import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  ArrowRight,
  X,
  Plus,
  Send,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  game_title: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  post_id: string;
  parent_id: string | null;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

const Community = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [shouldFocusComment, setShouldFocusComment] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(true);
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const commentFormRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 게시글 작성 폼 상태
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
      category: "토론",
    game_title: "",
  });

  // 댓글 작성 상태
  const [newComment, setNewComment] = useState("");

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:user_profiles!inner(id, username, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query.limit(displayCount);

      if (error) {
        // 외래 키 참조가 실패하면 author 없이 다시 시도
        let fallbackQuery = supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (selectedCategory !== "all") {
          fallbackQuery = fallbackQuery.eq('category', selectedCategory);
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery.limit(displayCount);
        
        if (fallbackError) throw fallbackError;

        // 작성자 정보를 별도로 가져오기
        const userIds = [...new Set((fallbackData || []).map((p: Post) => p.user_id))];
        const { data: profilesData } = await supabase
          .from('user_profiles')
          .select('id, username, display_name, avatar_url')
          .in('id', userIds);

        const profilesMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
        
        const dataWithAuthors = (fallbackData || []).map((post: Post) => ({
          ...post,
          author: profilesMap.get(post.user_id) || null,
        }));

        setPosts(dataWithAuthors);
        
        // 좋아요 여부 확인
        if (user && dataWithAuthors.length > 0) {
          const postIds = dataWithAuthors.map((p: Post) => p.id);
          const { data: likesData } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', postIds);

          if (likesData) {
            setLikedPostIds(new Set(likesData.map((l: any) => l.post_id)));
          }
        }
        
        return;
      }

      // 좋아요 여부 확인
      if (user && data) {
        const postIds = data.map((p: Post) => p.id);
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        if (likesData) {
          setLikedPostIds(new Set(likesData.map((l: any) => l.post_id)));
        }
      }

      setPosts(data || []);
      setError(null);
    } catch (error: any) {
      console.error('게시글 로드 오류:', error);
      setError(error);
      
      // 테이블이 없는 경우 특별한 메시지 표시
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        toast({
          title: "테이블이 생성되지 않았습니다",
          description: "Supabase에서 posts 테이블을 생성해주세요. database/community_tables.sql 파일을 실행하세요.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "오류",
          description: error.message || "게시글을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

      // 댓글 불러오기
  const fetchComments = async (postId: string) => {
    try {
      setCommentLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // 작성자 정보를 별도로 가져오기
      const userIds = [...new Set((data || []).map((c: Comment) => c.user_id))];
      const { data: profilesData } = await supabase
        .from('user_profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      const profilesMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
      
      const commentsWithAuthors = (data || []).map((comment: Comment) => ({
        ...comment,
        author: profilesMap.get(comment.user_id) || null,
      }));

      // 대댓글 구조화
      const topLevelComments = commentsWithAuthors.filter((c: Comment) => !c.parent_id);
      const replies = commentsWithAuthors.filter((c: Comment) => c.parent_id);

      const structuredComments = topLevelComments.map((comment: Comment) => ({
        ...comment,
        replies: replies.filter((r: Comment) => r.parent_id === comment.id),
      }));

      setComments(structuredComments);
    } catch (error: any) {
      console.error('댓글 로드 오류:', error);
      toast({
        title: "오류",
        description: "댓글을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, displayCount, user]);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  // 댓글 섹션으로 스크롤 및 포커스
  useEffect(() => {
    if (shouldFocusComment && isSheetOpen && commentSectionRef.current) {
      // 댓글 폼을 숨겼다가 부드럽게 나타나게
      setShowCommentForm(false);
      
      // Sheet가 열린 후 약간의 지연을 두고 스크롤
      setTimeout(() => {
        commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 댓글 폼을 부드럽게 나타나게
        setTimeout(() => {
          setShowCommentForm(true);
          
          // 댓글 입력란에 포커스
          setTimeout(() => {
            commentTextareaRef.current?.focus();
          }, 200);
        }, 300);
      }, 100);
      
      setShouldFocusComment(false);
    } else if (!shouldFocusComment) {
      // 일반적으로 열 때는 바로 표시
      setShowCommentForm(true);
    }
  }, [shouldFocusComment, isSheetOpen]);

  const categories = [
    { id: "all", label: "전체", icon: MessageSquare },
    { id: "토론", label: "토론", icon: Users },
    { id: "공략", label: "공략", icon: TrendingUp },
    { id: "파티", label: "파티", icon: Calendar }
  ];

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsSheetOpen(true);
    setShouldFocusComment(false);
  };

  const handleCommentIconClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPost(post);
    setIsSheetOpen(true);
    setShouldFocusComment(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedPost(null);
    setComments([]);
  };

  // 게시글 작성
  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "게시글을 작성하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          category: newPost.category,
          game_title: newPost.game_title.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "성공",
        description: "게시글이 작성되었습니다.",
      });

      setIsCreateDialogOpen(false);
      setNewPost({ title: "", content: "", category: "토론", game_title: "" });
      fetchPosts();
    } catch (error: any) {
      console.error('게시글 작성 오류:', error);
      
      // 테이블이 없는 경우 특별한 메시지 표시
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        toast({
          title: "테이블이 생성되지 않았습니다",
          description: "Supabase에서 posts 테이블을 생성해주세요. database/community_tables.sql 파일을 실행하세요.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "오류",
          description: error.message || "게시글 작성에 실패했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 좋아요 토글
  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "좋아요를 누르려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isLiked = likedPostIds.has(postId);

      if (isLiked) {
        // 좋아요 취소
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        if (error) throw error;

        setLikedPostIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });

        // 로컬 상태 업데이트
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p
        ));

        if (selectedPost?.id === postId) {
          setSelectedPost(prev => prev ? { ...prev, like_count: Math.max(0, prev.like_count - 1) } : null);
        }
      } else {
        // 좋아요 추가
        const { error } = await supabase
          .from('post_likes')
          .insert({
            user_id: user.id,
            post_id: postId,
          });

        if (error) throw error;

        setLikedPostIds(prev => new Set(prev).add(postId));

        // 로컬 상태 업데이트
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
        ));

        if (selectedPost?.id === postId) {
          setSelectedPost(prev => prev ? { ...prev, like_count: prev.like_count + 1 } : null);
        }
      }
    } catch (error: any) {
      console.error('좋아요 오류:', error);
      toast({
        title: "오류",
        description: "좋아요 처리에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 댓글 작성
  const handleSubmitComment = async (parentId: string | null = null) => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "댓글을 작성하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPost || !newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          post_id: selectedPost.id,
          content: newComment.trim(),
          parent_id: parentId,
        });

      if (error) throw error;

      toast({
        title: "성공",
        description: "댓글이 작성되었습니다.",
      });

      setNewComment("");
      fetchComments(selectedPost.id);

      // 게시글 댓글 수 업데이트
      setPosts(prev => prev.map(p => 
        p.id === selectedPost.id ? { ...p, comment_count: p.comment_count + 1 } : p
      ));

      if (selectedPost) {
        setSelectedPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : null);
      }
    } catch (error: any) {
      console.error('댓글 작성 오류:', error);
    toast({
        title: "오류",
        description: error.message || "댓글 작성에 실패했습니다.",
          variant: "destructive",
        });
    } finally {
      setSubmitting(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  // 작성자 이름 가져오기
  const getAuthorName = (post: Post) => {
    if (post.author?.display_name) return post.author.display_name;
    if (post.author?.username) return post.author.username;
    return "익명";
  };

  const getCommentAuthorName = (comment: Comment) => {
    if (comment.author?.display_name) return comment.author.display_name;
    if (comment.author?.username) return comment.author.username;
    return "익명";
  };

  return (
    <>
      <Helmet>
        <title>커뮤니티 - VORTEX</title>
        <meta 
          name="description" 
          content="게이머들과 소통하고 게임 정보를 공유하세요."
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="container mx-auto px-4 relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                    <span className="gradient-text">커뮤니티</span>
                  </h1>
                  <p className="text-muted-foreground font-body">
                    게이머들과 함께 소통하고 정보를 공유하세요
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-8 relative">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {categories.map((cat) => {
                  const count = cat.id === "all" 
                    ? posts.length 
                    : posts.filter(p => p.category === cat.id).length;
                  
                  return (
                  <button
                    key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setDisplayCount(6);
                      }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body font-medium text-sm uppercase tracking-wider transition-all ${
                      selectedCategory === cat.id
                        ? "bg-primary/20 text-primary border border-primary/30 glass"
                        : "glass border border-glass-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                      <span className="text-xs opacity-70">({count})</span>
                  </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Posts Grid */}
          <section className="py-12 relative">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="text-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">게시글을 불러오는 중...</p>
                </div>
              ) : posts.length > 0 ? (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                  <Card 
                        key={`${post.id}-${index}`} 
                    className="glass-card hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => handlePostClick(post)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-body font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                          {post.category}
                        </span>
                            <span className="text-xs text-muted-foreground">{formatDate(post.created_at)}</span>
                      </div>
                      <CardTitle className="font-display text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                            {post.game_title || "일반"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                                className={`gap-1 h-auto p-0 ${likedPostIds.has(post.id) ? 'text-accent' : 'text-muted-foreground'}`}
                            onClick={(e) => handleLike(post.id, e)}
                          >
                                <Heart className={`w-4 h-4 ${likedPostIds.has(post.id) ? 'fill-accent' : ''}`} />
                                <span>{post.like_count}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 h-auto p-0 text-muted-foreground"
                            onClick={(e) => handleCommentIconClick(post, e)}
                          >
                            <MessageCircle className="w-4 h-4" />
                                <span>{post.comment_count}</span>
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (navigator.share) {
                                  navigator.share({
                                    title: post.title,
                                    text: post.content.substring(0, 100),
                                    url: window.location.href,
                                  }).catch(() => {});
                                } else {
                                  navigator.clipboard.writeText(window.location.href).then(() => {
                                    toast({
                                      title: "링크가 복사되었습니다!",
                                      description: "게시물 링크를 클립보드에 복사했습니다.",
                                    });
                                  });
                                }
                              }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-glass-border/20">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta" />
                              <span className="text-sm font-body text-muted-foreground">{getAuthorName(post)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>

              {/* Load More */}
                  {posts.length >= displayCount && (
                <div className="flex justify-center mt-12">
                  <Button 
                    onClick={handleLoadMore}
                    variant="outline" 
                    className="gap-2 glass border-glass-border/30"
                  >
                    <span>더 많은 게시물 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">게시물이 없습니다</h3>
                  <p className="text-muted-foreground">
                    선택한 카테고리에 게시물이 없습니다.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Create Post CTA */}
          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <Card className="glass-card border-primary/30">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold mb-2">새로운 게시물 작성하기</h3>
                  <p className="text-muted-foreground mb-6">
                    게이머들과 경험을 공유하고 토론에 참여하세요
                  </p>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                  <Button variant="neon" className="gap-2">
                        <Plus className="w-4 h-4" />
                    게시물 작성
                  </Button>
                    </DialogTrigger>
                    <DialogContent className="glass border-glass-border/30 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="font-display text-2xl font-bold gradient-text">
                          새 게시물 작성
                        </DialogTitle>
                        <DialogDescription>
                          게이머들과 공유할 내용을 작성해주세요.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">제목</Label>
                          <Input
                            id="title"
                            placeholder="게시물 제목을 입력하세요"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">카테고리</Label>
                          <Select
                            value={newPost.category}
                            onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="토론">토론</SelectItem>
                              <SelectItem value="공략">공략</SelectItem>
                              <SelectItem value="파티">파티</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="game_title">게임 제목 (선택사항)</Label>
                          <Input
                            id="game_title"
                            placeholder="관련 게임 제목을 입력하세요"
                            value={newPost.game_title}
                            onChange={(e) => setNewPost({ ...newPost, game_title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="content">내용</Label>
                          <Textarea
                            id="content"
                            placeholder="게시물 내용을 입력하세요"
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            rows={10}
                            className="resize-none"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            disabled={submitting}
                          >
                            취소
                          </Button>
                          <Button
                            variant="neon"
                            onClick={handleCreatePost}
                            disabled={submitting || !newPost.title.trim() || !newPost.content.trim()}
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                작성 중...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                작성하기
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />

        {/* Post Detail Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            {selectedPost && (
              <>
                <SheetHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-body font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                          {selectedPost.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(selectedPost.created_at)}</span>
                      </div>
                      <SheetTitle className="font-display text-2xl mb-2">
                        {selectedPost.title}
                      </SheetTitle>
                      <SheetDescription className="text-base">
                        {selectedPost.game_title || "일반"}
                      </SheetDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseSheet}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-glass-border/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                      <span className="text-sm font-display font-bold text-primary-foreground">
                        {getAuthorName(selectedPost)[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-body font-medium text-foreground">{getAuthorName(selectedPost)}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedPost.created_at)}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="prose prose-invert max-w-none">
                    <div className="text-foreground font-body leading-relaxed whitespace-pre-line">
                      {selectedPost.content}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-glass-border/20">
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-2 ${likedPostIds.has(selectedPost.id) ? 'text-accent' : ''}`}
                        onClick={(e) => handleLike(selectedPost.id, e)}
                      >
                        <Heart className={`w-4 h-4 ${likedPostIds.has(selectedPost.id) ? 'fill-accent' : ''}`} />
                        <span>{selectedPost.like_count}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShouldFocusComment(true);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{selectedPost.comment_count}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: selectedPost.title,
                              text: selectedPost.content.substring(0, 100),
                              url: window.location.href,
                            }).catch(() => {});
                          } else {
                            navigator.clipboard.writeText(window.location.href).then(() => {
                              toast({
                                title: "링크가 복사되었습니다!",
                                description: "게시물 링크를 클립보드에 복사했습니다.",
                              });
                            });
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                        공유
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div ref={commentSectionRef} className="pt-6 border-t border-glass-border/20">
                    <h3 className="font-display font-bold text-lg mb-4">댓글 ({selectedPost.comment_count})</h3>
                    
                    {/* 댓글 작성 */}
                    {user && (
                      <div 
                        ref={commentFormRef}
                        className={`mb-6 space-y-2 transition-all duration-500 ease-out ${
                          showCommentForm 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-4 pointer-events-none'
                        }`}
                      >
                        <Textarea
                          ref={commentTextareaRef}
                          placeholder="댓글을 입력하세요..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                          className="resize-none transition-all duration-300"
                        />
                        <div className="flex justify-end">
                          <Button
                            variant="neon"
                            size="sm"
                            onClick={() => handleSubmitComment()}
                            disabled={submitting || !newComment.trim()}
                            className="transition-all duration-300"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                작성 중...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                댓글 작성
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* 댓글 목록 */}
                    {commentLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">댓글을 불러오는 중...</p>
                      </div>
                    ) : comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-display font-bold text-primary-foreground">
                                  {getCommentAuthorName(comment)[0]}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-base font-body font-medium text-foreground">
                                    {getCommentAuthorName(comment)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(comment.created_at)}
                                  </p>
                                </div>
                                <p className="text-base text-foreground whitespace-pre-line leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                            {/* 대댓글 */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-11 space-y-3 pl-4 border-l-2 border-glass-border/20">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-display font-bold text-primary-foreground">
                                        {getCommentAuthorName(reply)[0]}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-body font-medium text-foreground">
                                          {getCommentAuthorName(reply)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {formatDate(reply.created_at)}
                                        </p>
                                      </div>
                                      <p className="text-sm text-foreground whitespace-pre-line">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Community;

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: '회원가입 실패',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      if (data.user) {
        toast({
          title: '회원가입 성공',
          description: '회원가입이 완료되었습니다. 환영합니다!',
        });
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: '회원가입 실패',
        description: authError.message || '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
      return { error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: '로그인 실패',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      if (data.user) {
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: '로그인 실패',
        description: authError.message || '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: '로그아웃 실패',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '로그아웃 성공',
          description: '로그아웃되었습니다.',
        });
      }
    } catch (error) {
      toast({
        title: '로그아웃 실패',
        description: '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


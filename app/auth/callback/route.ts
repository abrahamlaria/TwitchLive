import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  
  try {
    const code = requestUrl.searchParams.get('code');
    const token = requestUrl.searchParams.get('token');
    const type = requestUrl.searchParams.get('type');

    if (token && type === 'signup') {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
        options: {
          redirectTo: '/'
        }
      });

      if (error) {
        console.error('Verification error:', error);
        return NextResponse.redirect(
          new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }

      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL('/?error=auth_callback_error', requestUrl.origin)
    );
  }
}
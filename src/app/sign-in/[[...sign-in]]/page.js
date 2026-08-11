import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'Sign in | CommonShelf',
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-11 w-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold shadow-sm">
            CS
          </div>
          <h1 className="text-2xl font-black text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to borrow and list neighborhood tools.</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/"
          />
        </div>
      </div>
    </main>
  );
}

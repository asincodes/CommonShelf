import { SignUp } from '@clerk/nextjs';

export const metadata = {
  title: 'Create an account | CommonShelf',
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-11 w-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold shadow-sm">
            CS
          </div>
          <h1 className="text-2xl font-black text-slate-900">Join CommonShelf</h1>
          <p className="mt-1 text-sm text-slate-500">Share useful tools with your neighborhood.</p>
        </div>
        <div className="flex justify-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/"
          />
        </div>
      </div>
    </main>
  );
}

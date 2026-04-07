import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
	return (
		<div className='h-screen flex items-center justify-center bg-zinc-900'>
			<SignUp
				appearance={{
					elements: {
						card: "bg-zinc-800 border-zinc-700",
						headerTitle: "text-white",
						headerSubtitle: "text-zinc-400",
						formFieldLabel: "text-zinc-300",
						formFieldInput: "bg-zinc-700 border-zinc-600 text-white",
						socialButtonsBlockButton: "bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600",
						socialButtonsBlockButtonText: "text-white",
						dividerLine: "bg-zinc-600",
						dividerText: "text-zinc-400",
						footerActionLink: "text-emerald-500 hover:text-emerald-400",
					},
				}}
				signInUrl='/login'
				forceRedirectUrl='/auth-callback'
			/>
		</div>
	);
};

export default SignUpPage;

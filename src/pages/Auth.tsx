import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signUpSchema, type SignInValues, type SignUpValues } from "@/schemas/authSchema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";

const Auth = () => {
  const { login, register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const redirectPath = (location.state as { from?: string })?.from ?? "/dashboard";

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptPrivacy: true,
    },
  });

  const handleSignIn = signInForm.handleSubmit(async (values) => {
    try {
      await login(values);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate(redirectPath, { replace: true });
    } catch (error) {
      signInForm.setError("root", { message: error instanceof Error ? error.message : "Unable to sign in" });
    }
  });

  const handleSignUp = signUpForm.handleSubmit(async (values) => {
    try {
      await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
        acceptPrivacy: values.acceptPrivacy,
      });
      toast({
        title: "Account created!",
        description: "Welcome to the community.",
      });
      navigate("/dashboard");
    } catch (error) {
      signUpForm.setError("root", { message: error instanceof Error ? error.message : "Unable to create account" });
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-[var(--shadow-glow)] transition-all group-hover:scale-110">
            <Calendar className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            The Speaker Platform
          </span>
        </Link>

        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      {...signInForm.register("email")}
                    />
                    {signInForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      {...signInForm.register("password")}
                    />
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" {...signInForm.register("remember")} />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setForgotPasswordOpen(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  {signInForm.formState.errors.root && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.root.message}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
                    disabled={signInForm.formState.isSubmitting}
                  >
                    {signInForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      {...signUpForm.register("name")}
                    />
                    {signUpForm.formState.errors.name && (
                      <p className="text-sm text-destructive">{signUpForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      {...signUpForm.register("email")}
                    />
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      {...signUpForm.register("password")}
                    />
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      {...signUpForm.register("confirmPassword")}
                    />
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" {...signUpForm.register("acceptPrivacy")} />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="text-primary underline">
                        privacy policy
                      </a>
                    </span>
                  </label>
                  {signUpForm.formState.errors.acceptPrivacy && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.acceptPrivacy.message}</p>
                  )}
                  {signUpForm.formState.errors.root && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.root.message}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
                    disabled={signUpForm.formState.isSubmitting}
                  >
                    {signUpForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button variant="outline" type="button">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      <ForgotPasswordDialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
    </div>
  );
};

export default Auth;

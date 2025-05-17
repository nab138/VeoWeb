"use client";
import { Input } from "@/ui/input";
import styles from "./login.module.css";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { login, signup } from "./actions";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const [signUp, setSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const action = signUp ? signup : login;
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }
      if (signUp && password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const result = await action({
        email,
        password,
      });
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(
          signUp ? "Account created successfully!" : "Logged in successfully!"
        );
        router.push("/dashboard");
      }
    },
    [signUp, email, password, confirmPassword]
  );

  return (
    <div className="centered-container">
      <main className={styles.main}>
        <Card>
          <h1>Welcome to Veo</h1>
          <p>Best lists app ever.</p>
          <hr style={{ margin: "var(--pad-sm) 0" }} />
          <h2>{signUp ? "Sign Up" : "Login"}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              autoComplete="email"
              aria-label="Email"
              aria-required="true"
              autoFocus
              placeholder="Email"
              required
              className={styles.input}
            />
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              autoComplete="current-password"
              aria-label="Password"
              aria-required="true"
              placeholder="Password"
              required
              className={styles.input}
            />
            {signUp && (
              <Input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                name="confirm-password"
                autoComplete="current-password"
                aria-label="Confirm Password"
                aria-required="true"
                placeholder="Confirm Password"
                required
                className={styles.input}
              />
            )}
            <Button type="submit">{signUp ? "Sign Up" : "Login"}</Button>
          </form>
          <p className={styles.toggle} onClick={() => setSignUp((old) => !old)}>
            {signUp
              ? "Already have an account? Log in!"
              : "Don't have an account? Sign up!"}
          </p>
        </Card>
      </main>
    </div>
  );
}

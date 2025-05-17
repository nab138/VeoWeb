import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/ui/button";

export default function NotFound() {
  return (
    <div className="centered-container">
      <main className={styles.main}>
        <h1>404 - Not Found</h1>
        <p>The page you've requested does not exist.</p>
        <div className={styles.actions}>
          <Link href="/" passHref>
            <Button variant="primary" size="large">
              Take me home (country roads)
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

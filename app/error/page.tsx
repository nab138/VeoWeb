"use client";
import Link from "next/link";
import styles from "../page.module.css";
import { Button } from "@/ui/button";

export default function Error() {
  return (
    <div className="centered-container">
      <main className={styles.main}>
        <h1>Error</h1>
        <p>Sorry, something went wrong</p>
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

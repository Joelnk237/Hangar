import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '../hero';
//import Blog from '../../blog/blog-list';
import Listing from '../property-list';
import Loader from '../../shared/Loader';




export default function HomeFBesitzer() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; rolle: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8888/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          // Token invalide ou expiré
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/signin");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error beim Aufruf von User-Infos :", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <Loader/>;

  return (
    <>
      {user && (
        <>
          <Hero />
          <Listing />
        </>
      )}
      
      {/*<Blog />*/}
    </>
  )
}

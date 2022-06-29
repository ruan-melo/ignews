import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { getPrismicClient } from "../../../services/prismic";
import {RichText} from 'prismic-dom';
import Head from "next/head";

import styles from '../post.module.scss';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface PostPreviewProps {
    post: {
      slug: string;
      title: string;
      content: string;
      updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps){

    const {data} = useSession()
    const router = useRouter()

    useEffect(() => {
        if (data?.activeSubscription) {
        router.push(`/posts/${post.slug}`)
        }
    }, [data])
 
    return(
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a href="">Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
    
}

export const getStaticPaths: GetStaticPaths = () => {
    return{
        paths: [], //Objetos contendo as props para as páginas as quais os posts serão gerados durante a *BUILD*
        fallback: 'blocking',
    }
}


export const getStaticProps: GetStaticProps = async ({params}) => {

    const {slug} = params;

    const prismic = getPrismicClient()

    const response = await prismic.getByUID<any>('publication', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),   
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      };
    
      return {
        props: {
          post,
        },
        redirect: 60 * 30, // 30 minutes
      }
}
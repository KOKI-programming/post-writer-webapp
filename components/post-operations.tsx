"use client";



import { Post } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Icon } from "./icon";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";






interface PostOperationsProps {
    post: Pick<Post, "id" | "title">;
}

export default function PostOperations({post}: PostOperationsProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);


    return (
        <>
         <DropdownMenu>
            <DropdownMenuTrigger>
               <Icon.ellipsis className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href = {`/editor/${post.id}`} className="w-full">編集</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive "  onClick={() => setShowDeleteAlert(true)}>
                    削除
                </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
         <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>本当にこの記事を削除しますか？</AlertDialogTitle>
      <AlertDialogDescription>
        この記事を削除すると、元に戻すことはできません。
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>キャンセル</AlertDialogCancel>
      <AlertDialogAction
      onClick={ async (e) => {
            e.preventDefault();
            setIsDeleteLoading(true);
           const deleted = await deletePost(post.id);

              if (deleted) {
                setShowDeleteAlert(false);
                setIsDeleteLoading(false);
                router.refresh();
              }}
             }
             className="bg-red-600 hover:bg-red-400 focus:ring-red-600 text-white font-bold py-2 px-4 rounded"
      >
        {isDeleteLoading ?  (<Icon.spinner className="animate-spin w-5 h-5" />
        ): (
        <Icon.trash className="w-4 h-4 mr-2"/>
        )}
        削除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

        </>
    )

    async function deletePost(postId: string) {
      try{
          const response = await fetch(`/api/posts/${postId}`, {
              method: "DELETE",
          });
  
          if (!response.ok) {
              throw new Error("Failed to delete post");
          }
  
          return true;
  
      } catch (error) {
          toast({
              title: "エラーが発生しました",
              description: "記事を削除できませんでした。もう一度お試しください。",
              variant: "destructive",
          })
      }
  }
}
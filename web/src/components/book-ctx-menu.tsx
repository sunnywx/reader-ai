import { DropdownMenu, Button } from "@radix-ui/themes";
import { EllipsisVertical as More } from "lucide-react";
import cs from "clsx";
import { Book } from "@/types/book";
import { useState } from "react";
import { AlertDialog } from "@/components/ui/dialog";
import {toast} from 'react-hot-toast'

interface Props {
  book: Book;
  className?: string;
}

export const BookCtxMenu = ({ book, className }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelBook=async ()=> {
    console.log('del book: ', book)

    toast.success('delete book done')
  }

  return (
    <>
      <div className={cs("absolute right-1 top-1", className)}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <More size={14} className="hover:bg-gray-100 rounded-md" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Read Later
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Add to liked books
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDelete(true);
              }}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <AlertDialog
        open={openDelete}
        title="Delete book"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelBook}
      >
        Are you sure to delete this book?
      </AlertDialog>
    </>
  );
};

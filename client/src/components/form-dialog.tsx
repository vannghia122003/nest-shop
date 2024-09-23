import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface IProps {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  btnTrigger?: React.ReactNode
}

function FormDialog({ open, onOpenChange, title, description, children, btnTrigger }: IProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {btnTrigger && <DialogTrigger asChild>{btnTrigger}</DialogTrigger>}
      <DialogContent
        className="max-h-screen overflow-y-auto sm:max-w-[600px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
export default FormDialog

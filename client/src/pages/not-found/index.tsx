import { IconHome } from '@tabler/icons-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import IMAGES from '@/utils/images'
import PATH from '@/utils/path'

function NotFound() {
  return (
    <div className="py-40">
      <Helmet>
        <title>Not Found</title>
        <meta name="description" content="Not Found Page" />
      </Helmet>
      <div className="container">
        <div className="m-auto flex size-full flex-col items-center justify-center gap-2">
          <img src={IMAGES.PAGE_404} alt="404 page" />
          <p className="text-2xl font-medium">Oops! Page Not Found!</p>
          <p className="text-center text-muted-foreground">
            It seems like the page you're looking for
            <br />
            does not exist or might have been removed.
          </p>
          <div className="mt-6 text-center">
            <Button asChild leftSection={<IconHome />}>
              <Link to={PATH.HOME} className="!p-5">
                Back to home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NotFound

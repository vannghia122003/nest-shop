import { Helmet } from 'react-helmet-async'

function PrivacyPolicy() {
  return (
    <div className="py-8">
      <Helmet>
        <title>Privacy Policy | Nest Shop</title>
        <meta name="description" content="Privacy Policy" />
      </Helmet>

      <div className="container">
        <h1 className="text-center text-4xl font-medium text-foreground">Privacy Policy</h1>
        <h2 className="mt-6 text-2xl font-medium">The type of personal information we collect</h2>
        <ul className="mt-4 list-disc pl-5">
          <li>We collect certain personal information about visitors and users of our Sites.</li>
          <li>
            The most common types of information we collect include things like: user-names, email
            addresses, other contact details, survey responses, blogs, photos
          </li>
        </ul>

        <h2 className="mt-6 text-2xl font-medium">How we collect personal information</h2>
        <ul className="mt-4 list-disc pl-5">
          <li>
            We collect personal information directly when you provide it to us, automatically as you
            navigate through the Sites, or through other people when you use services associated
            with the Sites.
          </li>
          <li>
            We collect your personal information when you provide it to us when you complete
            membership registration and buy or provide items or services on our Sites, subscribe to
            a newsletter, email list, submit feedback, enter a contest, fill out a survey, or send
            us a communication.
          </li>
        </ul>

        <h2 className="mt-6 text-2xl font-medium">How we use personal information</h2>
        <ul className="mt-4 list-disc pl-5">
          <li>Operating the Sites.</li>
          <li>Providing you with services described on the Sites.</li>
          <li>Verifying your identity when you sign in to any of our Sites.</li>
          <li>
            Updating you with operational news and information about our Sites and services e.g. to
            notify you about changes to our Sites, website disruptions or security updates.
          </li>
          <li>Improving our products and services.</li>
        </ul>

        <h2 className="mt-6 text-2xl font-medium">How we keep your personal information secure</h2>
        <ul className="mt-4 list-disc pl-5">
          <li>
            We store personal information on secure servers that are managed by us and our service
            providers. Personal information that we store or transmit is protected by security and
            access controls, including username and password authentication, two-factor
            authentication, and data encryption where appropriate.
          </li>
        </ul>

        <h2 className="mt-6 text-2xl font-medium">How you can access your personal information</h2>
        <ul className="mt-4 list-disc pl-5">
          <li>
            You can access some of the personal information that we collect about you by logging in
            to your account. You also have the right to make a request to access other personal
            information we hold about you and to request corrections of any errors in that data. You
            can also close the account you have with us for any of our Sites at any time.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PrivacyPolicy

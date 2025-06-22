
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  confirmationLink: string
  userEmail: string
  userName?: string
}

export const WelcomeEmail = ({
  confirmationLink,
  userEmail,
  userName,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Raw Smith Coffee - Confirm your account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://raw-smith-coffee.lovableproject.com/logo.png"
            width="120"
            height="120"
            alt="Raw Smith Coffee"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Welcome to Raw Smith Coffee!</Heading>
        
        <Text style={text}>
          {userName ? `Hello ${userName},` : 'Hello,'}
        </Text>
        
        <Text style={text}>
          Thank you for joining the Raw Smith Coffee loyalty program! We're excited to have you as part of our coffee community.
        </Text>
        
        <Text style={text}>
          To get started and earn your first 10 loyalty points, please confirm your email address by clicking the button below:
        </Text>
        
        <Section style={btnContainer}>
          <Button style={button} href={confirmationLink}>
            Confirm Your Account
          </Button>
        </Section>
        
        <Text style={text}>
          Once confirmed, you'll be able to:
        </Text>
        
        <Text style={benefits}>
          ☕ Earn points with every purchase<br />
          🏆 Unlock exclusive rewards and discounts<br />
          🎉 Join our community events<br />
          📱 Track your coffee journey
        </Text>
        
        <Text style={text}>
          This confirmation link will expire in 24 hours, so make sure to click it soon!
        </Text>
        
        <Text style={footer}>
          Welcome aboard!<br />
          The Raw Smith Coffee Team
        </Text>
        
        <Text style={disclaimer}>
          This email was sent to {userEmail}. If you didn't create an account with us, 
          you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#FAF6F0',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const logoSection = {
  textAlign: 'center' as const,
  margin: '0 0 40px',
}

const logo = {
  margin: '0 auto',
}

const h1 = {
  color: '#8B4513',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#6F4E37',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const benefits = {
  color: '#6F4E37',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#FFF8DC',
  borderLeft: '4px solid #8B4513',
  borderRadius: '4px',
}

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#8B4513',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
}

const footer = {
  color: '#6F4E37',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 16px',
}

const disclaimer = {
  color: '#8a8a8a',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
  textAlign: 'center' as const,
  borderTop: '1px solid #eaeaea',
  paddingTop: '16px',
}

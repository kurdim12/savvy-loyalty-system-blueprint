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

interface PasswordResetEmailProps {
  resetLink: string
  userEmail: string
}

export const PasswordResetEmail = ({
  resetLink,
  userEmail,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Raw Smith Coffee password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://raw-smith-loyalty.lovable.app/logo.png"
            width="120"
            height="120"
            alt="Raw Smith Coffee"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Reset Your Password</Heading>
        
        <Text style={text}>
          Hello,
        </Text>
        
        <Text style={text}>
          We received a request to reset the password for your Raw Smith Coffee account ({userEmail}).
        </Text>
        
        <Section style={btnContainer}>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
        </Section>
        
        <Text style={text}>
          This link will expire in 24 hours for security reasons.
        </Text>
        
        <Text style={text}>
          If you didn't request this password reset, you can safely ignore this email. 
          Your password will remain unchanged.
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
          The Raw Smith Coffee Team
        </Text>
        
        <Text style={disclaimer}>
          This email was sent to {userEmail}. If you have any questions, 
          please contact us at support@rawsmithcoffee.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

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

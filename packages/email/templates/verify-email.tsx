import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerifyEmailTemplateProps {
  readonly name: string;
  readonly otp: string;
}

export const VerifyEmailTemplate = ({
  name,
  otp,
}: VerifyEmailTemplateProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Your verification code: {otp}</Preview>
      <Body className="bg-zinc-50 font-sans">
        <Container className="mx-auto py-12">
          <Section className="mt-8 rounded-md bg-zinc-200 p-px">
            <Section className="rounded-[5px] bg-white p-8">
              <Heading className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
                Verify your email
              </Heading>
              <Text className="m-0 text-zinc-500">Hi {name},</Text>
              <Text className="mt-2 text-zinc-500">
                Use the code below to verify your email address:
              </Text>
              <Section className="my-8 text-center">
                <Text className="inline-block rounded-md bg-zinc-100 px-8 py-4 font-mono text-3xl text-zinc-900 tracking-widest">
                  {otp}
                </Text>
              </Section>
              <Text className="text-zinc-500">
                This code expires in 5 minutes.
              </Text>
              <Text className="text-zinc-500">
                If you did not create an account, you can safely ignore this
                email.
              </Text>
              <Hr className="my-4" />
              <Text className="text-xs text-zinc-400">
                Enter this code on the verification screen to activate your
                account.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

VerifyEmailTemplate.PreviewProps = {
  name: "Jane Smith",
  otp: "482916",
};

export default VerifyEmailTemplate;

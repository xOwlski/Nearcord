import {
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Loader,
  SimpleGrid,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Check } from 'tabler-icons-react';
import { useNearContext } from '../lib/context/Near';

const Index: NextPage = () => {
  const { PriLoading, AlertTxt, TwitterAcc, DiscordAcc, NearAcc, NearLogin } =
    useNearContext();

  const Router = useRouter();
  const Theme = useMantineTheme();

  return (
    <>
      <Center style={{ height: '100vh' }}>
        <SimpleGrid style={{ minWidth: '300px' }}>
          <Alert
            style={{ userSelect: 'none', textAlign: 'center' }}
            variant={PriLoading ? 'filled' : 'outline'}
          >
            {AlertTxt ? (
              <>
                <Text size="xs" color="red" weight="bold">
                  {AlertTxt}
                </Text>
              </>
            ) : (
              <>Once it&apos;s connected it is connected!</>
            )}
          </Alert>

          {PriLoading ? (
            <Center>
              <Loader variant="dots" />
            </Center>
          ) : (
            <>
              <Button
                color="dark"
                onClick={() => Router.replace('/auth/discord/login')}
                disabled={DiscordAcc !== null}
              >
                {DiscordAcc ? (
                  <Check color={Theme.colors.green[7]} />
                ) : (
                  <>Discord</>
                )}
              </Button>
              <Button
                color="dark"
                onClick={() => Router.replace('/auth/twitter/login')}
                disabled={DiscordAcc === null || TwitterAcc !== null}
              >
                {TwitterAcc ? (
                  <Check color={Theme.colors.green[7]} />
                ) : (
                  <>Twitter</>
                )}
              </Button>
              <Button
                color="dark"
                onClick={NearLogin}
                disabled={
                  DiscordAcc === null ||
                  TwitterAcc === null ||
                  NearAcc !== null ||
                  PriLoading
                }
              >
                {NearAcc ? <Check color={Theme.colors.green[7]} /> : <>Near</>}
              </Button>

              <Divider />

              <Button
                onClick={() => Router.replace('/auth/logout')}
                disabled={DiscordAcc === null}
                color="red"
                variant="filled"
              >
                Logout
              </Button>
            </>
          )}
        </SimpleGrid>
      </Center>
    </>
  );
};

export default Index;

import {
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';

function ShowToast() {
  const toast = useToast();
  const HandleShowToast = () => {
    toast.show({
      placement: 'top',
      render: ({ id }) => {
        const toastId = 'toast-' + id;
        return (
          <Toast nativeID={toastId} action='attention' variant='solid'>
            <VStack space='xs'>
              <ToastTitle>New Message</ToastTitle>
              <ToastDescription>
                Hey, just wanted to touch base and see how you're doing. Let's
                catch up soon!
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
  };
  return (
    <Button
      onPress={() => {
        toast.show({
          placement: 'top',
          render: ({ id }) => {
            const toastId = 'toast-' + id;
            return (
              <Toast nativeID={toastId} action='attention' variant='solid'>
                <VStack space='xs'>
                  <ToastTitle>New Message</ToastTitle>
                  <ToastDescription>
                    Hey, just wanted to touch base and see how you're doing.
                    Let's catch up soon!
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      }}
    >
      <ButtonText>Press Me</ButtonText>
    </Button>
  );
}

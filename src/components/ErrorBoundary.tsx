import { Component, ReactNode } from 'react';
import { Button, H4, Paragraph, YStack } from 'tamagui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled error caught by ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$3" backgroundColor="$background">
          <H4>Something went wrong</H4>
          <Paragraph color="$color10" textAlign="center">
            The app hit an unexpected error. Try restarting.
          </Paragraph>
          <Button onPress={() => this.setState({ hasError: false })}>Try again</Button>
        </YStack>
      );
    }
    return this.props.children;
  }
}

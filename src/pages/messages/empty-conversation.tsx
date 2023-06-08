import { Button } from '@material-tailwind/react';

export function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center wh-full">
      <div className="flex w-[330px] flex-col gap-1">
        <h1 className="text-3xl font-bold">Select a message</h1>
        <span className="text-sm text-color-accent">
          Choose from your existing conversations, start a new one, or just keep
          swimming.
        </span>

        <Button
          type="button"
          variant="gradient"
          color="blue"
          size="lg"
          className="mt-7 h-[54px] w-44 rounded-full text-base normal-case tracking-wide"
        >
          New message
        </Button>
      </div>
    </div>
  );
}

export default EmptyConversation;

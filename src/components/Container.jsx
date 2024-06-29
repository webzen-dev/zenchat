import Chat from "./chat/Chat";
import Detail from "./detail/Detail";
import List from "./list/List";
import "../index.css";
import { useChatStore } from "../lib/chatStore";
const Container = () => {
  const { chatId } = useChatStore();
  const open = false
  return (
    <>
      <List />
      {chatId && <Chat open={open} />} {chatId && <Detail open={open} />}
    </>
  );
};

export default Container;
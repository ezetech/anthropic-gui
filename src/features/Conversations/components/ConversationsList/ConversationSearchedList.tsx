import { selectConversationsSearchedList } from '@/redux/conversations/conversations.selectors';
import { useAppSelector } from '@/redux/hooks';

import { ChatItem } from './components/ChatItem';

import styles from './ConversationsList.module.scss';

export const ConversationSearchedList = ({
  searchName,
}: {
  searchName: string;
}) => {
  const conversations = useAppSelector(
    selectConversationsSearchedList(searchName),
  );

  return (
    <div className={styles.wrapper}>
      {conversations?.length ? (
        conversations.map(conversation => (
          <ChatItem conversationItem={conversation} key={conversation.id} />
        ))
      ) : (
        <p>No results</p>
      )}
    </div>
  );
};

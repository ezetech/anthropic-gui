import { selectConversationsSearchedList } from '@/redux/conversations/conversations.selectors';
import { useAppSelector } from '@/redux/hooks';
import { TreeItem } from '@/typings/types';

import { SearchItem } from './components/SearchItem';

import styles from './ChatsTreeSearch.module.scss';

export const ChatsTreeSearch = ({ searchName }: { searchName: string }) => {
  const conversations = useAppSelector(
    selectConversationsSearchedList(searchName),
  );

  return (
    <div className={styles.wrapper}>
      {conversations?.length ? (
        conversations.map((conversation: TreeItem) => (
          <SearchItem conversationItem={conversation} key={conversation.id} />
        ))
      ) : (
        <p>No results</p>
      )}
    </div>
  );
};

ChatsTreeSearch.displayName = 'ChatsTreeSearch';

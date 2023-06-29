import React, {
  ChangeEvent,
  MouseEvent,
  useState,
  forwardRef,
  HTMLAttributes,
  memo,
} from 'react';

import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { NavLink, useParams, useNavigate, To } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants/routes';
import { renameChatTreeItem } from '@/redux/conversations/conversationsSlice';
import { useAppDispatch } from '@/redux/hooks';
import { IconComponent } from '@/ui/IconComponent';
import { TextFieldComponent } from '@/ui/TextFieldComponent';

import styles from './TreeItem.module.scss';

export interface Props extends HTMLAttributes<HTMLLIElement> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  name: string;
  type: string;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      name,
      type,
      wrapperRef,
      ...props
    },
    ref,
  ) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedItemName, setEditedItemName] = useState(name);
    const [itemPlaceholder, setItemPlaceholder] = useState(true);

    const dispatch = useAppDispatch();
    const { id } = useParams();
    const navigation = useNavigate();

    const onClickDelete = (event: MouseEvent) => {
      event.stopPropagation();
      setIsDeleting(true);
    };

    const onCancel = (event?: MouseEvent) => {
      event?.stopPropagation();
      setIsDeleting(false);
      setIsEditing(false);
      if (name !== editedItemName) {
        setEditedItemName(name);
      }
    };

    const onConfirm = (event: MouseEvent) => {
      event.stopPropagation();
      if (isDeleting) {
        onRemove?.();
        setIsDeleting(false);
      }
      if (isEditing) {
        if (editedItemName) {
          dispatch(
            renameChatTreeItem({
              chatTreeId: value,
              chatTreeName: editedItemName,
            }),
          );
        }
        setIsEditing(false);
      }
    };

    const onClickEdit = (event: MouseEvent) => {
      event.stopPropagation();
      setIsEditing(true);
    };

    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      setEditedItemName(event.target.value);
    };

    const onClickInput = (event: MouseEvent) => {
      event.stopPropagation();
    };

    const onOutsideClick = () => {
      if (isDeleting || isEditing) {
        onCancel();
      }
    };

    const onChatClick = (event: MouseEvent, route: To) => {
      event.stopPropagation();
      navigation(route);
    };

    const onCollapsePlaceholder = (event: MouseEvent) => {
      event.stopPropagation();
      setItemPlaceholder(!itemPlaceholder);
      if (onCollapse) {
        onCollapse();
      }
    };

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <li
          {...props}
          className={classNames(
            styles.Wrapper,
            { [styles.clone]: clone },
            { [styles.ghost]: ghost },
            { [styles.disableSelection]: disableSelection },
            { [styles.disableInteraction]: disableInteraction },
          )}
          ref={wrapperRef}
          style={
            {
              marginLeft: `${indentationWidth * depth}px`,
              borderLeft:
                depth && !clone && !ghost
                  ? '1px solid var(--bg-default)'
                  : 'none',
              borderRadius: depth && !clone && !ghost ? '0px' : '',
            } as React.CSSProperties
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              className={classNames(styles.wrapperItem, {
                [styles.editing]: isEditing,
                [styles.selected]: value === id,
              })}
              ref={ref}
              style={style}
              onMouseDown={onCollapsePlaceholder}
            >
              {type === 'chat' && (
                <IconComponent
                  {...handleProps}
                  className={styles.conversationIcon}
                  type="conversation"
                />
              )}

              {type === 'folder' &&
                (collapsed ? (
                  <IconComponent
                    {...handleProps}
                    className={styles.folderIcon}
                    type="openedFolder"
                  />
                ) : (
                  <IconComponent
                    {...handleProps}
                    className={styles.folderIcon}
                    type="closedFolder"
                  />
                ))}

              {isEditing ? (
                <TextFieldComponent
                  value={editedItemName}
                  onChange={onChangeName}
                  className={styles.editInput}
                  autoFocus
                  fullWidth
                  onClick={onClickInput}
                />
              ) : (
                <>
                  {type === 'folder' ? (
                    <span {...handleProps} className={styles.TextFolder}>
                      {name}
                    </span>
                  ) : (
                    <NavLink to={`${ROUTES.Chat}/${value}`}>
                      <span
                        {...handleProps}
                        onMouseDown={e =>
                          onChatClick(e, `${ROUTES.Chat}/${value}`)
                        }
                        className={styles.TextChat}
                      >
                        {name}
                      </span>
                    </NavLink>
                  )}
                </>
              )}

              {isEditing || isDeleting ? (
                <div className={styles.confirmation}>
                  <IconComponent type="confirm" onClick={onConfirm} />
                  <IconComponent type="cancel" onClick={onCancel} />
                </div>
              ) : (
                <div className={styles.settings}>
                  <IconComponent type="edit" onClick={onClickEdit} />
                  <IconComponent type="deleteIcon" onClick={onClickDelete} />
                </div>
              )}
            </div>
            {type === 'folder' && !onCollapse && (
              <div
                className={classNames(styles.nestedContent)}
                hidden={itemPlaceholder}
              >
                <p>Empty folder</p>
                <p>Drag conversations to add</p>
              </div>
            )}
          </div>
        </li>
      </OutsideClickHandler>
    );
  },
);

export const TreeItemMemo = memo(TreeItem);

TreeItem.displayName = 'TreeItem';

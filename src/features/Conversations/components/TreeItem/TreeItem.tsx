import React, {
  ChangeEvent,
  HTMLAttributes,
  MouseEvent,
  forwardRef,
  memo,
  useState,
} from 'react';

import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

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
  depth?: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: HTMLAttributes<HTMLDivElement>;
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
      depth = 0,
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
          const trimmedName = editedItemName.trim();
          setEditedItemName(trimmedName.trim());
          dispatch(
            renameChatTreeItem({
              chatTreeId: value,
              chatTreeName: trimmedName,
            }),
          );
          setEditedItemName(trimmedName);
        }
        setIsEditing(false);
      }
    };

    const onClickEdit = (event: {
      stopPropagation: () => void;
      preventDefault: () => void;
    }) => {
      event.stopPropagation();
      setEditedItemName(name);
      setIsEditing(true);
      event.preventDefault();
    };

    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      setEditedItemName(event.target.value);
    };

    const onOutsideClick = () => {
      if (isDeleting || isEditing) {
        onCancel();
      }
    };

    const onItemMouseDown = (event: MouseEvent) => {
      event.stopPropagation();
      if (onCollapse && type === 'folder' && !isEditing) {
        onCollapse();
      }

      if (type === 'chat') {
        navigation(`${ROUTES.Chat}/${value}`);
      }
    };

    const handleNoDrag = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target?.dataset?.nodrag && (!isEditing || !isDeleting)) {
        return;
      } else {
        handleProps?.onPointerDown?.(
          event as React.PointerEvent<HTMLDivElement>,
        );
      }
    };

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <li
          {...props}
          className={classNames(
            styles.Wrapper,
            clone && styles.clone,
            ghost && styles.ghost,
            indicator && styles.indicator,
            disableSelection && styles.disableSelection,
            disableInteraction && styles.disableInteraction,
          )}
          ref={wrapperRef}
          style={
            {
              marginLeft: `${indentationWidth * depth}px`,
            } as React.CSSProperties
          }
        >
          <div
            onPointerDown={handleNoDrag}
            className={classNames(styles.wrapperItem, {
              [styles.editing]: isEditing,
              [styles.selected]: value === id,
              [styles.folder]: type === 'folder',
            })}
            ref={ref}
            style={{
              ...style,
              borderLeft:
                depth && !clone ? '1px solid var(--bg-default)' : 'none',
              borderRadius: depth && !clone ? '0' : '8px',
            }}
            onMouseDown={onItemMouseDown}
          >
            <div className={styles.itemName}>
              {type === 'chat' && (
                <IconComponent
                  className={styles.conversationIcon}
                  type="conversation"
                />
              )}

              {type === 'folder' &&
                (onCollapse && !!childCount ? (
                  <IconComponent
                    className={styles.folderIcon}
                    type="openedFolder"
                  />
                ) : (
                  <IconComponent
                    className={styles.folderIcon}
                    type="closedFolder"
                  />
                ))}

              {isEditing ? (
                <TextFieldComponent
                  autoComplete="off"
                  inputProps={{ 'data-nodrag': true }}
                  value={editedItemName}
                  onChange={onChangeName}
                  className={styles.editInput}
                  autoFocus
                  fullWidth
                  onClick={handleNoDrag}
                />
              ) : (
                <>
                  {type === 'folder' ? (
                    <span className={styles.TextFolder}>{name}</span>
                  ) : (
                    <NavLink
                      to={`${ROUTES.Chat}/${value}`}
                      className={classNames({
                        [styles.selected]: value === id,
                      })}
                    >
                      <span
                        className={classNames(styles.TextChat, {
                          [styles.selected]: value === id,
                        })}
                      >
                        {name}
                      </span>
                    </NavLink>
                  )}
                </>
              )}

              {isEditing || isDeleting ? (
                <div className={styles.confirmation}>
                  <IconComponent
                    data-nodrag="true"
                    type="confirm"
                    onMouseDown={onConfirm}
                  />
                  <IconComponent
                    data-nodrag="true"
                    type="cancel"
                    onMouseDown={onCancel}
                  />
                </div>
              ) : (
                <div className={styles.settings}>
                  <IconComponent
                    data-nodrag="true"
                    type="edit"
                    onMouseDown={onClickEdit}
                  />
                  <IconComponent
                    data-nodrag="true"
                    type="deleteIcon"
                    onMouseDown={onClickDelete}
                  />
                </div>
              )}
            </div>

            {type === 'folder' && childCount === 0 && !ghost && (
              <div
                className={classNames(styles.nestedContent)}
                hidden={collapsed || isEditing}
              >
                <div>
                  <p>Empty folder</p>
                  <p>Drag conversations to add</p>
                </div>
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

import styles from './tagsBlock.module.scss';

const { tagsContainer, tagItem } = styles;

const getTagStyles = (tag) => {
  const selectedTagColors = tag.color;

  return {
    backgroundColor: selectedTagColors.bgColorHex,
    color: selectedTagColors.textColorHex,
    border: selectedTagColors && '1px solid transparent',
  };
};

export const TagsBlock = ({ tags }) => {
  return (
    <div className={tagsContainer}>
      {tags.map((tag) => (
        <div key={tag.id} style={getTagStyles(tag)} className={tagItem}>
          {tag.title}
        </div>
      ))}
    </div>
  );
};

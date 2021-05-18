import styles from '../styles/components/dropzone.module.scss';
import { useState } from 'react';

const Dropzone = props => {
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState(null);

  return (
    <div className={`${styles.dropzone} ${drag ? styles.dropzone_drag : ''}`}>
      <input
        type="file"
        id={props.id || 'file'}
        name={props.name || 'file'}
        onChange={e => { props.onChange(e); setFiles(e.target.files)}}
        className={styles.dropzone__input}
        onDragEnter={() => setDrag(true)}
        onDragLeave={() => setDrag(false)}
        onDrop={() => setDrag(false)}
        multiple={props.multiple}
        accept={props.accept}
      />
      <span className={styles.dropzone__text}>
        {
          files
          ? files.length === 1 ? 'Выбран 1 файл' : `Выбрано ${files.length} файла`
          : 'Перетащите сюда файлы, или просто кликните'
        }
      </span>
    </div>
  );
};

export default Dropzone;
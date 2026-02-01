import styles from "./Search.module.css";

const Search = ({ content, onChange }) => {
    return (
        <div className={styles.searchBox}>
            <input 
                type="text" 
                placeholder={content} 
                onChange={onChange}  
            />
            <span className={styles.searchIcon}>🔍</span>
        </div>
    );
};

export default Search;
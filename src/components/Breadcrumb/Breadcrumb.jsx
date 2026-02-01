
import styles from "./Breadcrumb.module.css";
const Breadcrumb = ({ contant }) => {
     return (
          <>
               <div className={styles.Breadcrumb}>
                    لوحة التحكم / {contant}
               </div>    </>
     )


}


export default Breadcrumb;
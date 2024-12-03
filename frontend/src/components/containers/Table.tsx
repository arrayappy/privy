import ColorClass from "src/types/enums/ColorClass";
import FontClass from "src/types/enums/FontClass";
import joinClasses from "src/utils/joinClasses";
import styles from "@/css/containers/Table.module.css";

export type TableColumn<T> = {
  header: string;
  accessor: keyof T;
  width?: string;
  mobileLabel?: string;
  render?: (value: any, item: T, index: number) => JSX.Element;
};

type Props<T> = {
  className?: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  fontClass?: FontClass;
  headerColorClass?: ColorClass;
  onRowClick?: (item: T) => void;
};

export default function Table<T extends object>({
  className,
  columns,
  data,
  emptyMessage = "No data available",
  fontClass = FontClass.Body1,
  headerColorClass = ColorClass.Navy,
  onRowClick,
}: Props<T>): JSX.Element {
  return (
    <div className={joinClasses(styles.container, className)}>
      <table className={styles.table}>
        {/* Desktop Header */}
        <thead className={styles.desktopHeader}>
          <tr>
            {columns.map((column, colIndex) => (
              <th
                key={`header-${colIndex}-${String(column.accessor)}`}
                className={joinClasses(styles.headerCell, headerColorClass)}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={fontClass}>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyMessage}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className={joinClasses(
                  styles.row,
                  onRowClick ? styles.clickable : null
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}-${String(column.accessor)}`}
                    className={styles.cell}
                    data-label={column.mobileLabel || column.header}
                  >
                    {column.render ? (
                      column.render(item[column.accessor], item, rowIndex)
                    ) : (
                      String(item[column.accessor])
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

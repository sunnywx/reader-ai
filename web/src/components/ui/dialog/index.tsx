import {
  CSSProperties,
  ReactNode,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  MouseEventHandler
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.scss";
import cs from "clsx";
import { debounce } from "lodash";
import {X as IconClose} from 'lucide-react'

export interface DialogProps {
  className?: string;
  wrapperCls?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  closable?: boolean;
  open?: boolean;
  withBottomLine?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: (e: MouseEventHandler<any>) => void;
  mountMaskTo?: HTMLElement;
  hideFooter?: boolean;
}

export const Dialog = ({
  className,
  wrapperCls,
  style = {},
  width,
  height,
  title = "",
  children,
  actions,
  closable = true,
  open,
  onOpenChange,
  onClose,
  withBottomLine,
  mountMaskTo,
  hideFooter,
}: DialogProps) => {
  const [mounted, setMounted] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const initialHeight = useMemo(
    () => (typeof height === "number" ? `${height}px` : height),
    [height]
  ) as string;

  const fixHeight = useCallback(() => {
    if (!mainRef.current) {
      return;
    }
    const mainDom = mainRef.current as HTMLDivElement;
    const body = document.body;

    if (mainDom.clientHeight >= body.clientHeight - 80) {
      mainDom.style.height = "calc(100vh - 80px)";

      if (mainDom.clientHeight > parseInt(initialHeight)) {
        mainDom.style.height = initialHeight;
      }
    } else if (height) {
      mainDom.style.height = initialHeight;
    }
  }, [mainRef.current, initialHeight]);

  const debouncedFixHeight = debounce(fixHeight, 300, { trailing: true });

  useEffect(() => {
    window.addEventListener("resize", debouncedFixHeight);

    return () => {
      window.removeEventListener("resize", debouncedFixHeight);
    };
  }, []);

  useEffect(() => {
    onOpenChange?.(!!open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) {
    return null;
  }

  const renderDialog = () => {
    return (
      <div
        className={cs(
          styles.dialog,
          "flow-dialog",
          { [styles.open]: open },
          wrapperCls
        )}
        onClick={e=> {
          e.stopPropagation()
        }}
      >
        <div className={styles.mask} />
        <div
          className={cs(styles.main, "flow-dialog__main", className)}
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
            ...style,
          }}
          ref={mainRef}
        >
          <div className={cs(styles.header, "flow-dialog__header")}>
            <h2 className={styles.title}>{title}</h2>
            {closable && (
              <IconClose
                className={styles.close}
                size={18}
                onClick={e=> onClose(e)}
              />
            )}
          </div>

          <div className={cs(styles.body, "flow-dialog__body")}>{children}</div>

          {!hideFooter && (
            <div
              className={cs(
                styles.footer,
                { [styles.bottomLine]: withBottomLine },
                "flow-dialog__footer"
              )}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  };

  // make sure portal elements inside radix-ui theme provider, otherwise styles will missing
  return createPortal(
    renderDialog(),
    mountMaskTo ||
      document.getElementsByClassName("radix-themes")[0] ||
      document.body
  );
};

export * from './alert-dialog'

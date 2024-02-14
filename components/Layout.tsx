import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return <div className="layout">{children}</div>;
}

export default Layout;

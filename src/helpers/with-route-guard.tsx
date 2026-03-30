import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DEFAULT_AUTHENTICATED_PATH, LOGIN_PATH } from "@/constants/auth";

import { getAuthSession } from "@/lib/auth";

type RouteComponentProps = {
  children: ReactNode;
};

type AsyncRouteComponent<TProps extends RouteComponentProps> = (
  props: TProps
) => ReactNode | Promise<ReactNode>;

interface PrivateRouteOptions {
  redirectTo?: string;
}

interface PublicRouteOptions {
  authenticatedRedirectTo?: string;
}

export const withPrivateRoute = <TProps extends RouteComponentProps>(
  WrappedComponent: AsyncRouteComponent<TProps>,
  options: PrivateRouteOptions = {}
): AsyncRouteComponent<TProps> => {
  const { redirectTo = LOGIN_PATH } = options;

  return async function PrivateRouteGuard(props: TProps) {
    const session = await getAuthSession();

    if (!session) {
      redirect(redirectTo);
    }

    return <WrappedComponent {...props} />;
  };
};

export const withPublicRoute = <TProps extends RouteComponentProps>(
  WrappedComponent: AsyncRouteComponent<TProps>,
  options: PublicRouteOptions = {}
): AsyncRouteComponent<TProps> => {
  const { authenticatedRedirectTo = DEFAULT_AUTHENTICATED_PATH } = options;

  return async function PublicRouteGuard(props: TProps) {
    const session = await getAuthSession();

    if (session) {
      redirect(authenticatedRedirectTo);
    }

    return <WrappedComponent {...props} />;
  };
};

export const withLayout = <TProps extends RouteComponentProps>(
  WrappedComponent: AsyncRouteComponent<TProps>,
  LayoutComponent: AsyncRouteComponent<RouteComponentProps>
): AsyncRouteComponent<TProps> => {
  return async function LayoutGuard(props: TProps) {
    return <LayoutComponent>{await WrappedComponent(props)}</LayoutComponent>;
  };
};

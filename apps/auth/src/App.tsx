import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import SuccessState from "./components/SuccessState";

enum StateEnum {
  ACCESS_DENIED = "ACCESS_DENIED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  CREDS_POST_ERROR = "CREDS_POST_ERROR",
  SUCCESS = "SUCCESS",
}

const App = () => {
  const [state, setState] = useState<StateEnum | null>(null);

  const onSuccess = useCallback(
    async (accessToken: string, refreshToken: string) => {
      try {
        await axios.post("http://localhost:9697/credentials", {
          accessToken,
          refreshToken,
        });

        setState(StateEnum.SUCCESS);
      } catch (error) {
        console.log(error);

        setState(StateEnum.CREDS_POST_ERROR);
      }
    },
    []
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const error = queryParams.get("error");

    if (error) {
      if (error === "access_denied") {
        setState(StateEnum.ACCESS_DENIED);
      } else {
        setState(StateEnum.UNKNOWN_ERROR);
      }

      return;
    }

    const hash = new URLSearchParams(window.location.hash.substring(1));

    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");

    if (accessToken && refreshToken) {
      onSuccess(accessToken, refreshToken);
    }
  }, []);

  switch (state) {
    case StateEnum.ACCESS_DENIED:
      return <p>Access Denied</p>;

    case StateEnum.UNKNOWN_ERROR:
      return <p>Unknown Error</p>;

    case StateEnum.CREDS_POST_ERROR:
      return <p>Credentials Post Error</p>;

    case StateEnum.SUCCESS:
      return <SuccessState />;

    default:
      return <p>Loading...</p>;
  }
};

export default App;

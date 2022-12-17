import React from "react";
import Layout from "./Layout";

interface Props {
  heading: string;
}

const FailureState: React.FC<Props> = (props) => {
  const { heading } = props;

  return (
    <Layout>
      <div className="text-white flex flex-col h-[100vh] items-center justify-center gap-10">
        <h1 className="text-[3rem] font-bold">{heading}</h1>
        <p>
          Something went wrong, please return to{" "}
          <span className="font-semibold">Depulso CLI</span> and try again.
        </p>
      </div>
    </Layout>
  );
};

export default FailureState;

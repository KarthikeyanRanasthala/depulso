import Layout from "./Layout";

const SuccessState = () => (
  <Layout>
    <div className="text-white flex flex-col h-[100vh] items-center justify-center gap-10">
      <h1 className="text-[3rem] font-bold">CLI Login Successful</h1>
      <div className="flex flex-col gap-6 items-center">
        <p>
          <span className="font-semibold">Depulso CLI</span> has been
          sucessfully authenticated
        </p>
        <p>
          You can now close this tab and return to{" "}
          <span className="font-semibold">Depulso CLI</span>
        </p>
      </div>
    </div>
  </Layout>
);

export default SuccessState;

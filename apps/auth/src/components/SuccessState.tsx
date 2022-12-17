const SuccessState = () => (
  <div className="text-white flex flex-col h-[100vh] items-center justify-center gap-10">
    <h1 className="text-6xl font-bold">CLI Login Successful</h1>
    <div className="flex flex-col gap-6 items-center">
      <p className="text-base">
        Depulso CLI has been sucessfully authenticated
      </p>
      <p>You can now close this tab and return to Depulso CLI</p>
    </div>
  </div>
);

export default SuccessState;

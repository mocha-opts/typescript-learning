type DescribableFunction = {
  description: string;
  (someArg: number): boolean; //调用签名（Call Signatures）
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

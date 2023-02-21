# typescript-learning

## Function

### 函数类型表达式（Function Type Expressions）

语法 (a: string) => void 表示一个函数有一个名为 a ，类型是字符串的参数，这个函数并没有返回任何值。

### 调用签名（Call Signatures）

语法 (a: string) : void 表示一个函数有一个名为 a ，类型是字符串的参数，这个函数并没有返回任何值。

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

### 构造签名 （Construct Signatures）

调用签名和构造签名合并在一起，类似于 Date 对象，可以直接调用

```typescript
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

### 泛型函数 （Generic Functions）

```typescript
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

### 推断（Inference）

```typescript
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): OutPut[] {
  return arr.map(func);
}
```

### 约束（Constraints）

要求函数返回两个值中更长的那个，为此，我们需要保证传入的值有一个 number 类型的 length 属性。我们使用 extends 语法来约束函数参数：

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  return a.length < b.length ? a : b;
}
```

### 泛型约束实战（Working with Constrained Values）

反例

```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
    // Type '{ length: number; }' is not assignable to type 'Type'.
    // '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
  }
}
```

### 声明类型参数 （Specifying Type Arguments）

并不是所有使用了泛型的函数都能够推断出返回结果的类型，比如下面这个合并两个数组的函数

```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

这么调用会有问题：

```typescript
const arr = combine([1, 2, 3], ["hello"]);
// Type 'string' is not assignable to type 'number'.
```

如果执意要这么做，那就指定类型

```typescript
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

### 写好泛型函数的建议

#### 类型参数下移（Push Type Parameters Down）

关于本节原文中的 push down 含义，在《重构》里，就有一个函数下移（Push Down Method）的优化方法，指如果超类中的某个函数只与一个或者少数几个子类有关，那么最好将其从超类中挪走，放到真正关心它的子类中去。即只在超类保留共用的行为。这种将超类中的函数本体复制到具体需要的子类的方法就可以称之为 "push down"，与本节中的去除 extend any[]，将其具体的推断交给 Type 自身就类似于 push down。

#### 使用更少的类型参数 (Use Fewer Type Parameters)

#### 类型参数应该出现两次 （Type Parameters Should Appear Twice）

### 可选参数（Optional Parameters）

可以使用 ? 表示这个参数是可选的：

```typescript
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

尽管这个参数被声明为 number 类型，x 实际上的类型为 number | undefiend，这是因为在 JavaScript 中未指定的函数参数就会被赋值 undefined。

你当然也可以提供有一个参数默认值：

```typescript
function f(x = 10) {
  // ...
}
```

现在在 f 函数体内，x 的类型为 number，因为任何 undefined 参数都会被替换为 10。注意当一个参数是可选的，调用的时候还是可以传入 undefined：

```typescript
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```

#### 回调中的可选参数（Optional Parameters in Callbacks）

### 函数重载（Function Overloads）

一些 JavaScript 函数在调用的时候可以传入不同数量和类型的参数。举个例子。你可以写一个函数，返回一个日期类型 Date，这个函数接收一个时间戳（一个参数）或者一个 月/日/年 的格式 (三个参数)。
在 TypeScript 中，我们可以通过写重载签名 (overlaod signatures) 说明一个函数的不同调用方法。 我们需要写一些函数签名 (通常两个或者更多)，然后再写函数体的内容：

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);

// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```

#### 重载签名和实现签名（Overload Signatures and the Implementation Signature）

### 其他需要知道的类型

void：void 表示一个函数并不会返回任何值，当函数并没有任何返回值，或者返回不了明确的值的时候，就应该用这种类型。

在 JavaScript 中，一个函数并不会返回任何值，会隐式返回 undefined，但是 void 和 undefined 在 TypeScript 中并不一样。

object 这个特殊的类型 object 可以表示任何不是原始类型（primitive）的值 (string、number、bigint、boolean、symbol、null、undefined)。object 不同于空对象类型 { }，也不同于全局类型 Object。很有可能你也用不到 Object。
unknown unknown 类型可以表示任何值。有点类似于 any，但是更安全，因为对 unknown 类型的值做任何事情都是不合法的
never 一些函数从来不返回值：

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}
```

当 TypeScript 确定在联合类型中已经没有可能是其中的类型的时候，never 类型也会出现：

```typescript
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

Function

在 JavaScript，全局类型 Function 描述了 bind、call、apply 等属性，以及其他所有的函数值。

它也有一个特殊的性质，就是 Function 类型的值总是可以被调用，结果会返回 any 类型：

```typescript
function doSomething(f: Function) {
  f(1, 2, 3);
}
```

这是一个无类型函数调用 (untyped function call)，这种调用最好被避免，因为它返回的是一个不安全的 any 类型。

如果你准备接受一个黑盒的函数，但是又不打算调用它，() => void 会更安全一些。

### 剩余参数（Rest Parameters and Arguments）

parameters 与 arguments
arguments 和 parameters 都可以表示函数的参数，由于本节内容做了具体的区分，所以我们定义 parameters 表示我们定义函数时设置的名字即形参，arguments 表示我们实际传入函数的参数即实参。

#### 剩余参数（Rest Parameters）

除了用可选参数、重载能让函数接收不同数量的函数参数，我们也可以通过使用剩余参数语法（rest parameters），定义一个可以传入数量不受限制的函数参数的函数：

剩余参数必须放在所有参数的最后面，并使用 ... 语法：

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

在 TypeScript 中，剩余参数的类型会被隐式设置为 any[] 而不是 any，如果你要设置具体的类型，必须是 Array<T> 或者 T[]的形式，再或者就是元组类型（tuple type）。

#### 剩余参数（Rest Arguments）

我们可以借助一个使用 ... 语法的数组，为函数提供不定数量的实参。举个例子，数组的 push 方法就可以接受任何数量的实参：

```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

## 对象类型（Object types）

### 属性修饰符

###

```typescript
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
type OneOrManyOrNull<Type> = OneOrMany<Type> | null;
type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
type OneOrManyOrNullStrings = OneOrMany<string> | null;
```

#### 在泛型约束中使用类型参数（Using Type Parameters in Generic Constraints）

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
```

#### 在泛型中使用类类型（Using Class Types in Generics）

```typescript
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

## keyof 操作符

## typeof 操作符

## 索引访问类型

我们可以使用 **索引访问类型（indexed access type）** 查找另外一个类型上的特定属性：

```typescript
type Person = {
  age: number;
  name: string;
  alive: boolean;
};
type Age = Person["age"]; // type Age = number
```

因为索引名本身就是一个类型，所以我们也可以使用联合、keyof 或者其他类型：

```typescript
type L1 = Person["age" | "name"]; // type L1 = string | number
type L2 = Person[keyof Person]; // type L2 = string | number | boolean

type AliveOrName = "alive" | "name";
type L3 = Person[AliveOrName]; // type L3 = string | boolean
```

接下来是另外一个示例，我们使用 number 来获取数组元素的类型。结合 typeof 可以方便的捕获数组字面量的元素类型：

```typescript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];
// type Person = {
//    name: string;
//    age: number;
// }

type Age = typeof MyArray[number]["age"]; // type Age = number
// Or
type Age2 = Person["age"];
// type Age2 = number
```

作为索引的只能是类型，这意味着你不能使用 const 创建一个变量引用：

```typescript
const key = "age";
type Age = Person[key];

// Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
```

然而你可以使用类型别名实现类似的重构：

```typescript
type key = "age";
type Age = Person[key];
```

实践案例

```typescript
const APP = ["TaoBao", "Tmall", "Alipay"] as const;
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"

function getPhoto(app: app) {
  // ...
}

getPhoto("TaoBao"); // ok
getPhoto("whatever"); // not ok
```

我们来一步步解析：

首先是使用 as const 将数组变为 readonly 的元组类型：

```typescript
const APP = ["TaoBao", "Tmall", "Alipay"] as const;
// const APP: readonly ["TaoBao", "Tmall", "Alipay"]
```

但此时 APP 还是一个值，我们通过 typeof 获取 APP 的类型：

```typescript
type typeOfAPP = typeof APP;
// type typeOfAPP = readonly ["TaoBao", "Tmall", "Alipay"]
```

最后在通过索引访问类型，获取字符串联合类型：

```typescript
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"
```

## 条件类型（Conditional Types）

```typescript
interface Animal {
  live(): void;
}

interface Dog extends Animal {
  woof(): void;
}
type Example1 = Dog extends Animal ? number : string;
//type Example1 = number

type Example2 = RegExp extends Animal ? number : string;
//type Example2 = string
```

条件类型的写法有点类似于 JavaScript 中的条件表达式（condition ? trueExpression : falseExpression ）：

```typescript

SomeType extends OtherType ? TrueType : FalseType
```

单从这个例子，可能看不出条件类型有什么用，但当搭配泛型使用的时候就很有用了，让我们拿下面的 createLabel 函数为例：

```typescript
interface IdLabel {
  id: number;
}
interface NameLabel {
  name: string;
}
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;

function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

这里使用了函数重载，描述了 createLabel 是如何基于输入值的类型不同而做出不同的决策，返回不同的类型。注意这样一些事情：

如果一个库不得不在一遍又一遍的遍历 API 后做出相同的选择，它会变得非常笨重。
我们不得不创建三个重载，一个是为了处理明确知道的类型，我们为每一种类型都写了一个重载（这里一个是 string，一个是 number），一个则是为了通用情况 （接收一个 string | number）。而如果增加一种新的类型，重载的数量将呈指数增加。
其实我们完全可以用把逻辑写在条件类型中：

```typescript
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

使用这个条件类型，我们可以简化掉函数重载：

```typescript
function createLabel<T extends number | string>(nameOrId: T): NameOrId<T> {
  throw "unimplemented";
}
let a = createLabel("typescript");
// let a: NameLabel

let b = createLabel(2.8);
// let b: IdLabel
let c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel
```

### 条件类型约束 （Conditional Type Constraints）

通常，使用条件类型会为我们提供一些新的信息。正如使用 类型保护（type guards） 可以 收窄类型（narrowing） 为我们提供一个更加具体的类型，条件类型的 true 分支也会进一步约束泛型，举个例子：

```typescript
type MessageOf<T> = T["message"];
// Type '"message"' cannot be used to index type 'T'.
```

TypeScript 报错是因为 T 不知道有一个名为 message 的属性。我们可以约束 T，这样 TypeScript 就不会再报错：

```typescript
type MessageOf<T extends { message: unknown }> = T["message"];
interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>; //type EmailMessageContents = string
```

但是，如果我们想要 MessgeOf 可以传入任何类型，但是当传入的值没有 message 属性的时候，则返回默认类型比如 never 呢？

我们可以把约束移出来，然后使用一个条件类型：

```typescript
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}
interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>; //type EmailMessageContents = string

type DogMessageContents = MessageOf<Dog>; // type DogMessageContents = never
```

再举一个例子，我们写一个 Flatten 类型，用于获取数组元素的类型，当传入的不是数组，则直接返回传入的类型：

```typescript
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // type Str = string

type Num = Flatten<number>; // type Num = number
```

注意这里使用了索引访问类型 (opens new window)里的 number 索引，用于获取数组元素的类型。

### 在条件类型里推断（Inferring Within Conditional Types）

条件类型提供了 infer 关键词，可以从正在比较的类型中推断类型，然后在 true 分支里引用该推断结果。借助 infer，我们修改下 Flatten 的实现，不再借助索引访问类型“手动”的获取出来：

```typescript
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

这里我们使用了 infer 关键字声明了一个新的类型变量 Item ，而不是像之前在 true 分支里明确的写出如何获取 T 的元素类型，这可以解放我们，让我们不用再苦心思考如何从我们感兴趣的类型结构中挖出需要的类型结构。

我们也可以使用 infer 关键字写一些有用的 类型帮助别名（helper type aliases）。举个例子，我们可以获取一个函数返回的类型：

```typescript
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>; // type Num = number

type Str = GetReturnType<(x: string) => string>; // type Str = string

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>; // type Bools = boolean[]
```

当从多重调用签名（就比如重载函数）中推断类型的时候，会按照最后的签名进行推断，因为一般这个签名是用来处理所有情况的签名。

```typescript
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<type stringOrNum>
```

### 分发条件类型（Distributive Conditional Types）

当泛型中使用条件类型的时候，如果传入一个联合类型，就会变成**分发的**（distributive）

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = string[] | number[]
```

如果我们在 **ToArray** 传入一个联合类型，这个条件类型会被应用到联合类型的每个成员

StrArrOrNumArr 里发生了什么：传入 **string | number**的类型,遍历联合类型里的成员，相当于：

```typescript
ToArray<string> | ToArray<number>;
```

所以最后的结果是：

```typescript
string[] | number[];
```

通常这是我们期望的行为，如果你要避免这种行为，你可以用方括号包裹 extends 关键字的每一部分。

```typescript
type ToArrayNonDist<Type> = [Type] extends [any] ? [Type] : never;

type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```

## 映射类型

### 映射类型（Mapped Types）

映射类型就是为了方便我们从一个类型的基础上生成一个新的类型

映射类型建立在索引签名的语法上，我们先回顾下索引签名：

```typescript
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};
const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

而映射类型，就是使用了 PropertyKeys 联合类型的泛型，其中 PropertyKeys 多是通过 keyof 创建，然后循环遍历键名创建一个类型：

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

在这个例子中，OptionsFlags 会遍历 Type 所有的属性，然后设置为布尔类型。

```typescript
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//    darkMode: boolean;
//    newUserProfile: boolean;
// }
```

### 映射修饰符（Mapping Modifiers）

在使用映射类型时，有两个额外的修饰符可能会用到，一个是 readonly，用于设置属性只读，一个是 ? ，用于设置属性可选。
你可以通过前缀 - 或者 + 删除或者添加这些修饰符，如果没有写前缀，相当于使用了 + 前缀。

```typescript
// 删除属性中的只读属性

type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
type UnlockedAccount = CreateMutable<LockedAccount>;
// type UnlockedAccount = {
//    id: string;
//    name: string;
// }
```

```typescript
// 删除属性中的可选属性
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
// type User = {
//    id: string;
//    name: string;
//    age: number;
// }
```

### 通过 as 实现键名重新映射（Key Remapping via as）

在 TypeScript 4.1 及以后，你可以在映射类型中使用 as 语句实现键名重新映射：

```typescript
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

举个例子，你可以利用「模板字面量类型」，基于之前的属性名创建一个新属性名：

```typescript
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;

// type LazyPerson = {
//    getName: () => string;
//    getAge: () => number;
//    getLocation: () => string;
// }
```

你也可以利用条件类型返回一个 never 从而过滤掉某些属性:

```typescript
// Remove the 'kind' property
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

// type KindlessCircle = {
//    radius: number;
// }
```

你还可以遍历任何联合类型，不仅仅是 string | number | symbol 这种联合类型，可以是任何类型的联合：

```typescript
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
// type Config = {
//    square: (event: SquareEvent) => void;
//    circle: (event: CircleEvent) => void;
// }
```

### 深入探索（Further Exploration）

映射类型也可以跟其他的功能搭配使用，举个例子，这是一个使用条件类型的映射类型，会根据对象是否有 pii 属性返回 true 或者 false :

```typescript
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
// type ObjectsNeedingGDPRDeletion = {
//    id: false;
//    name: true;
// }
```

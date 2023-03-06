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

## 模板字面量类型（Template Literal Types）

模板字面量类型以字符串字面量类型 (opens new window)为基础，可以通过联合类型扩展成多个字符串。
它们跟 JavaScript 的模板字符串是相同的语法，但是只能用在类型操作中。当使用模板字面量类型时，它会替换模板中的变量，返回一个新的字符串字面量：

```javascript
type World = 'world';

type Greeting=`hello ${World}`
```

当模板中的变量是一个联合类型时，每一个可能的字符串字面量都会被表示：

```typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

如果模板字面量里的多个变量都是联合类型，结果会交叉相乘，比如下面的例子就有 2 _ 2 _ 3 一共 12 种结果：

```typescript
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
```

如果真的是非常长的字符串联合类型，推荐提前生成，这种还是适用于短一些的情况。

### 类型中的字符串联合类型（String Unions in Types）

模板字面量最有用的地方在于你可以基于一个类型内部的信息，定义一个新的字符串，让我们举个例子：

有这样一个函数 makeWatchedObject， 它会给传入的对象添加了一个 on 方法。在 JavaScript 中，它的调用看起来是这样：makeWatchedObject(baseObject)，我们假设这个传入对象为：

```typescript
const passedObject = {
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
};
```

这个 on 方法会被添加到这个传入对象上，这个方法接受两个参数：eventName（string 类型）和 callback（function 类型）

```typescript
// 伪代码
const result = makeWatchedObject(baseObject);
result.on(eventName, callBack);
```

我们希望 eventName 是这种形式：passedObject 又一个属性 firstName，对应产生的 eventName 为 firstNameChanged，lastName、age 同理
当这个 callBack 函数被调用的时候：

- 应该被传入与 attributeInThePassedObject 相同类型的值。比如 passedObject 中， firstName 的值的类型为 string , 对应 firstNameChanged 事件的回调函数，则接受传入一个 string 类型的值。age 的值的类型为 number，对应 ageChanged 事件的回调函数，则接受传入一个 number 类型的值。
- 返回值类型为 void 类型。

on() 方法的签名最一开始是这样的：on(eventName: string, callBack: (newValue: any) => void)。 使用这样的签名，我们是不能实现上面所说的这些约束的，这个时候就可以使用模板字面量：

```typescript
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// makeWatchedObject has added `on` to the anonymous Object
person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

on 方法添加的事件名为 "firstNameChanged"， 而不仅仅是 "firstName"，而回调函数传入的值 newValue ，我们希望约束为 string 类型。我们先实现第一点。

在这个例子里，我们希望传入的事件名的类型，是对象属性名的联合，只是每个联合成员都还在最后拼接一个 Changed 字符，在 JavaScript 中，我们可以做这样一个计算：

```typescript
Object.keys(passedObject).map((x) => `${x}Changed`);
```

模板字面量提供了一个相似的字符串操作：

```typescript
type PropEventScource<Type> = {
  on(
    eventName: `${string & keyof Type}Changed`,
    callback: (newValue: any) => void
  ): void;
};
/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;
```

注意，我们在这里例子中，模板字面量里我们写的是 string & keyof Type，我们可不可以只写成 keyof Type 呢？如果我们这样写，会报错：

```typescript
type PropEventSource<Type> = {
  on(
    eventName: `${keyof Type}Changed`,
    callback: (newValue: any) => void
  ): void;
};

// Type 'keyof Type' is not assignable to type 'string | number | bigint | boolean | null | undefined'.
// Type 'string | number | symbol' is not assignable to type 'string | number | bigint | boolean | null | undefined'.
// ...
```

从报错信息中，我们也可以看出报错原因，在 《TypeScript 系列之 Keyof 操作符》 (opens new window)里，我们知道 keyof 操作符会返回 string | number | symbol 类型，但是模板字面量的变量要求的类型却是 string | number | bigint | boolean | null | undefined，比较一下，多了一个 symbol 类型，所以其实我们也可以这样写：

```typescript
type PropEventSource<Type> = {
  on(
    eventName: `${Exclude<keyof Type, symbol>}Changed`,
    callback: (newValue: any) => void
  ): void;
};
```

再或者这样写：

```typescript
type PropEventSource<Type> = {
  on(
    eventName: `${Extract<keyof Type, string>}Changed`,
    callback: (newValue: any) => void
  ): void;
};
```

使用这种方式，在我们使用错误的事件名时，TypeScript 会给出报错：

```typescript
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", () => {});

// Prevent easy human error (using the key instead of the event name)
person.on("firstName", () => {});
// Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.

// It's typo-resistant
person.on("frstNameChanged", () => {});
// Argument of type '"frstNameChanged"' is not assignabl
```

#### 模板字面量的推断（Inference with Template Literals）

现在我们来实现第二点，回调函数传入的值的类型与对应的属性值的类型相同。我们现在只是简单的对 callBack 的参数使用 any 类型。实现这个约束的关键在于借助泛型函数：

1. 捕获泛型函数第一个参数的字面量，生成一个字面量类型
2. 该字面量类型可以被对象属性构成的联合约束
3. 对象属性的类型可以通过索引访问获取
4. 应用此类型，确保回调函数的参数类型与对象属性的类型是同一个类型

```typescript
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};
declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", (newName) => {
  // (parameter) newName: string
  console.log(`new name is ${newName.toUpperCase()}`);
});

person.on("ageChanged", (newAge) => {
  // (parameter) newAge: number
  if (newAge < 0) {
    console.warn("warning! negative age");
  }
});
```

这里我们把 on 改成了一个泛型函数。

当一个用户调用的时候传入 "firstNameChanged"，TypeScript 会尝试着推断 Key 正确的类型。它会匹配 key 和 "Changed" 前的字符串 ，然后推断出字符串 "firstName" ，然后再获取原始对象的 firstName 属性的类型，在这个例子中，就是 string 类型。

### 内置字符操作类型（Intrinsic String Manipulation Types）

#### Uppercase

把每个字符转为大写形式：

```typescript
type Greeting = "Hello,world";
type ShoutGreeting = Uppercase<Greeting>;
// type ShoutyGreeting = "HELLO, WORLD"

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainId = ASCIICacheKey<"my_app">; // type MainID = "ID-MY_APP"
```

#### Lowercase

把每个字符转为小写形式：

```typescript
type Greeting = "Hello,world";
type QuietGreeting = Lowercase<Greeting>;
// type QuietGreeting = "hello, world"

type ASCIICacheKey<Str extends string> = `ID-${Lowercase<Str>}`;
type MainId = ASCIICacheKey<"MY_APP">; // type MainID = "ID-my_app"
```

#### Capitalize

把字符串的第一个字符转为大写形式：

```typescript
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
// type Greeting = "Hello, world"
```

#### Uncapitalize

把字符串的第一个字符转换为小写形式：

```typescript
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
// type UncomfortableGreeting = "hELLO WORLD"
```

从 TypeScript 4.1 起，这些内置函数会直接使用 JavaScript 字符串运行时函数，而不是本地化识别 (locale aware)。

### 类（Classes）

TypeScript 完全支持 ES2015 引入的 class 关键字。

### 类成员（Class Members）

这是一个最基本的类，一个空类：

```typescript
class Point {}
```

这个类并没有什么用，所以让我们添加一些成员。

#### 字段（Fields）

```typescript
class Point {
  x: number;
  y: number;
}
const pt = new Point();
pt.x = 0;
pt.y = 0;
```

一个字段声明会创建一个公共（public）和可写入（writeable）的属性

> 注意：类型注解是可选的，如果没有指定，会隐式的设置为 any

字段可以设置初始值(initializers),初始值会被用于推断它的类型:

```typescript
class Point {
  x = 0;
  y = 0;
}
const pt = new Point();
// Prints 0, 0

pt.x = "0";
// Type 'string' is not assignable to type 'number'.
```

--strictPropertyInitialization ,这个选项控制了类字段是否需要在构造函数里初始化：

```typescript
class BadGreeter {
  name: string;
  // Property 'name' has no initializer and is not definitely assigned in the constructor.
}
```

```typescript
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

注意，字段需要在构造函数自身进行初始化。TypeScript 并不会分析构造函数里你调用的方法，进而判断初始化的值，因为一个派生类也许会覆盖这些方法并且初始化成员失败：

```typescript
class BadGreeter{
  name:string;
   // Property 'name' has no initializer and is not definitely assigned in the constructor.

  setName():string;{
    this.name= 123''
  }
  constructor(){
    this.setName();
  }
}
```

如果你执意要通过其他方式初始化一个字段，而不是在构造函数里（举个例子，引入外部库为你补充类的部分内容），你可以使用明确赋值断言操作符（definite assignment assertion operator） !:

```typescript
class OKGreeter {
  name!: string;
}
```

#### readonly

字段可以添加一个 readonly 前缀修饰符，这会阻止再构造函数之外的赋值

```typescript
class Greeter {
  readonly name: string = "world";
  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }
  err() {
    this.name = "not ok ";
    // Cannot assign to 'name' because it is a read-only property.
  }
}

const g = new Greeter();
g.name = "also not ok";
// Cannot assign to 'name' because it is a read-only property.
```

#### 构造函数（Constructors）

类的构造函数跟函数非常类似，你可以使用带类型注解的参数、默认值、重载等。

```typescript
class Point {
  x: number;
  y: number;

  // Normal signature with defaults

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```typescript
class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```

但类构造函数签名与函数签名之间也有一些区别：

- 构造函数不能有类型参数（关于类型参数，回想下泛型里的内容），这些属于外层的类声明，我们稍后就会学习到。
- 构造函数不能有返回类型注解 ，因为总是返回类实例类型

**
Super 调用（Super Calls）
**

就像在 JavaScript 中，如果有一个基类，你必须在使用任何 this. 成员之前，先在构造函数里调用 super()。

```typescript
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // Prints a wrong value in ES5; throws exception in ES6
    console.log(this.k);
    // 'super' must be called before accessing 'this' in the constructor of a derived class.
    super();
  }
}
```

忘记调用 super 是 JavaScript 中一个简单的错误，但是 TypeScript 会在需要的时候提醒你。

#### 方法（Methods）

类中的函数属性被称为方法。方法跟函数、构造函数一样，使用相同的类型注解。

```typescript
class Point {
  x = 10;
  y = 10;
  scale(n: number): void {
    this.x = x;
    this.y = y;
  }
}
```

注意在一个方法体内，它依然可以通过 this. 访问字段和其他的方法。方法体内一个未限定的名称（unqualified name，没有明确限定作用域的名称）总是指向闭包作用域里的内容。

```typescript
let x: number = 0;
class C {
  x: string = "123";
  m() {
    // This is trying to modify 'x' from line 1, not the class property
    x = "world";
    // Type 'string' is not assignable to type 'number'.
  }
}
```

#### Getters / Setter

类也可以有存取器（accessors）：

```typescript
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

TypeScript 对存取器有一些特殊的推断规则：

如果 get 存在而 set 不存在，属性会被自动设置为 readonly
如果 setter 参数的类型没有指定，它会被推断为 getter 的返回类型
getters 和 setters 必须有相同的成员可见性（Member Visibility）。

从 TypeScript 4.3 起，存取器在读取和设置的时候可以使用不同的类型。

```typescript
class Thing {
  _size = 0;

  // 注意这里返回的是 number 类型
  get size(): number {
    return this._size;
  }

  // 注意这里允许传入的是 string | number | boolean 类型
  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN, Infinity, etc
    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

#### 索引签名（Index Signatures）

类可以声明索引签名，他和对象类型的索引签名是一样的：

```typescript
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);
  check(s: string) {
    return this[s] as boolean;
  }
}
```

### 类继承（Class Heritage）

JS 的类可以继承基类

#### implements 语句（implements Clauses）

可以使用 implements 语句检查一个类是否满足一个特定的接口（interface）。如果一个类没有正确的实现（implement）它，Typescript 就会报错：

```typescript
interface Pingable {
  ping();
  void;
}
class Sonar implements Pingable {
  ping() {
    console.log("ping");
  }
}
class Ball implements Pingable {
  // Class 'Ball' incorrectly implements interface 'Pingable'.
  // Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
  pong() {
    console.log("ping");
  }
}
```

类也可以实现多个接口，比如 class C implements A, B {}

> 注意事项（Cautions）
> implements 语句仅仅检查类是否按照接口类型实现，但它并不会改变类的类型或者方法的类型。一个常见的错误就是以为 implements 语句会改变类的类型——然而实际上它并不会：

```typescript
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {
    // Parameter 's' implicitly has an 'any' type.
    // Notice no error here
    return s.toLowercse() === "ok";
    // any
  }
}
```

在这个例子中，我们可能会以为 s 的类型会被 check 的 name: string 参数影响。实际上并没有，implements 语句并不会影响类的内部是如何检查或者类型推断的。

类似的，实现一个有可选属性的接口，并不会创建这个属性：

```typescript
interface A{
  x:number;
  y?:number;
}
class C implement A{
  x=0
}
const c = new C();
c.y=10;

// Property 'y' does not exist on type 'C'.

```

#### extends 语句（extends Clauses）

类可以 extend 一个基类。一个派生类有基类所有的属性和方法，还可以定义额外的成员。

```typescript
class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}
const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

**
覆写属性（Overriding Methods）
**
一个派生类可以覆写一个基类的字段或属性。你可以使用 super 语法访问基类的方法。
TypeScript 强制要求派生类总是它的**基类的子类型**。
举个例子，这是一个合法的覆写方法的方式：

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}
const d = new Derived();
d.greet();
d.greet("reader");
```

派生类需要遵循着它的基类的实现。
而且通过一个基类引用指向一个派生类实例，这是非常常见并合法的：

```typescript
// Alias the derived instance through a base class reference
const b: Base = d;
// No problem
b.greet();
```

但是如果 Derived 不遵循 Base 的约定实现呢？

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // Make this parameter required
  greet(name: string) {
    // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
    // Type '(name: string) => void' is not assignable to type '() => void'.
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

即便我们忽视错误编译代码，这个例子也会运行错误：

```typescript
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

**初始化顺序（Initialization Order）
**
有些情况下，JavaScript 类初始化的顺序会让你感到很奇怪，让我们看这个例子：

```typescript
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// Prints "base", not "derived"
const d = new Derived();
```

到底发生了什么呢？

类初始化的顺序，就像在 JavaScript 中定义的那样：

1. 基类字段初始化
2. 基类构造函数运行
3. 派生类字段初始化
4. 派生类构造函数运行

这意味着基类构造函数只能看到它自己的 name 的值，因为此时派生类字段初始化还没有运行。

**继承内置类型（Inheriting Built-in Types）**

在 ES2015 中，当调用 super(...) 的时候，如果构造函数返回了一个对象，会隐式替换 this 的值。所以捕获 super() 可能的返回值并用 this 替换它是非常有必要的。

这就导致，像 Error、Array 等子类，也许不会再如你期望的那样运行。这是因为 Error、Array 等类似内置对象的构造函数，会使用 ECMAScript 6 的 new.target 调整原型链。然而，在 ECMAScript 5 中，当调用一个构造函数的时候，并没有方法可以确保 new.target 的值。 其他的降级编译器默认也会有同样的限制。

对于一个像下面这样的子类：

```typescript
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return "hello " + this.message;
  }
}
```

你也许可以发现：

对象的方法可能是 undefined ，所以调用 sayHello 会导致错误
instanceof 失效， (new MsgError()) instanceof MsgError 会返回 false。

我们推荐，手动的在 super(...) 调用后调整原型：

```typescript
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
```

不过，任何 MsgError 的子类也不得不手动设置原型。如果运行时不支持 Object.setPrototypeOf，你也许可以使用 **proto** 。

### 成员可见性（Member Visibility）

你可以使用 TypeScript 控制某个方法或者属性是否对类以外的代码可见。

public
类成员默认的可见性为 public，一个 public 的成员可以在任何地方被获取：

```typescript
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

因为 public 是默认的可见性修饰符，所以你不需要写它，除非处于格式或者可读性的原因。

#### **protected**

protected 成员仅仅对子类可见：

```typescript
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // OK
g.getName();

// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

#### **受保护成员的公开（Exposure of protected members）**

派生类需要遵循基类的实现，但是依然可以选择公开拥有更多能力的基类子类型，这就包括让一个 protected 成员变成 public：

```typescript
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

#### **交叉等级受保护成员访问（Cross-hierarchy protected access）**

不同的 OOP 语言在通过一个基类引用是否可以合法的获取一个 protected 成员是有争议的。

//TODO 不理解

```typescript
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10;
    // Property 'x' is protected and only accessible through an instance of class 'Derived2'. This is an instance of class 'Base'.
  }
}
```

在 Java 中，这是合法的，而 C# 和 C++ 认为这段代码是不合法的。

TypeScript 站在 C# 和 C++ 这边。因为 Derived2 的 x 应该只有从 Derived2 的子类访问才是合法的，而 Derived1 并不是它们中的一个。此外，如果通过 Derived1 访问 x 是不合法的，通过一个基类引用访问也应该是不合法的。

#### private

private 有点像 protected ，但是不允许访问成员，即便是子类。

```typescript
class Base {
  private x = 0;
}
const b = new Base();
// Can't access from outside the class
console.log(b.x);
// Property 'x' is private and only accessible within class 'Base'.
```

```typescript
class Derived extends Base {
  showX() {
    // Can't access in subclasses
    console.log(this.x);
    // Property 'x' is private and only accessible within class 'Base'.
  }
}
```

因为 private 成员对派生类并不可见，所以一个派生类也不能增加它的可见性：

```typescript
class Base {
  private x = 0;
}
class Derived extends Base {
  // Class 'Derived' incorrectly extends base class 'Base'.
  // Property 'x' is private in type 'Base' but not in type 'Derived'.
  x = 1;
}
```

#### 交叉实例私有成员访问（Cross-instance private access）

不同的 OOP 语言在关于一个类的不同实例是否可以获取彼此的 private 成员上，也是不一致的。像 Java、C#、C++、Swift 和 PHP 都是允许的，Ruby 是不允许。

TypeScript 允许交叉实例私有成员的获取：

```typescript
class A {
  private x = 10;

  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

> 警告（Caveats）
> private 和 protected 仅仅在类型检查的时候才会强制生效。
> 这意味着在 JavaScript 运行时，像 in 或者简单的属性查找，依然可以获取 private 或者 protected 成员。

### 静态成员（Static Members）

类可以有静态成员，静态成员跟类实例没有关系，可以通过类本身访问到：

```typescript
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

静态成员同样可以使用 public protected 和 private 这些可见性修饰符：

```typescript
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
// Property 'x' is private and only accessible within class 'MyClass'.
```

静态成员也可以被继承：

```typescript
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

#### 特殊静态名称（Special Static Names）

类本身是函数，而覆写 Function 原型上的属性通常认为是不安全的，因此不能使用一些固定的静态名称，函数属性像 name、length、call 不能被用来定义 static 成员：

```typescript
class S {
  static name = "S!";
  // Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}
```

#### 为什么没有静态类？（Why No Static Classes?）

TypeScript（和 JavaScript） 并没有名为静态类（static class）的结构，但是像 C# 和 Java 有。

所谓静态类，指的是作为类的静态成员存在于某个类的内部的类。比如这种：

```java

// java
public class OuterClass {
  private static String a = "1";
	static class InnerClass {
  	private int b = 2;
  }
}

```

静态类之所以存在是因为这些语言强迫所有的数据和函数都要在一个类内部，但这个限制在 TypeScript 中并不存在，所以也没有静态类的需要。一个只有一个单独实例的类，在 JavaScript/TypeScript 中，完全可以使用普通的对象替代。
举个例子，我们不需要一个 static class 语法，因为 TypeScript 中一个常规对象（或者顶级函数）可以实现一样的功能：

```typescript
// Unnecessary "static" class
class MyStaticClass {
  static doSomething() {}
}

// Preferred (alternative 1)
function doSomething() {}

// Preferred (alternative 2)
const MyHelperObject = {
  dosomething() {},
};
```

### 类静态块（static Blocks in Classes）

静态块允许你写一系列有自己作用域的语句，也可以获取类里的私有字段。这意味着我们可以安心的写初始化代码：正常书写语句，无变量泄漏，还可以完全获取类中的属性和方法。

```typescript
class Foo {
  static #count = 0;

  get count() {
    return Foo.#count;
  }

  static {
    try {
      const lastInstances = loadLastInstances();
      Foo.#count += lastInstances.length;
    } catch {}
  }
}
```

### 泛型类（Generic Classes）

类跟接口一样，也可以写泛型。当使用 new 实例化一个泛型类，它的类型参数的推断跟函数调用是同样的方式：

```typescript
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
const b = new Box("hello!");
// const b: Box<string>
```

类跟接口一样也可以使用泛型约束以及默认值。

### 静态成员中的类型参数（Type Parameters in Static Members）

这代码并不合法，但是原因可能并没有那么明显：

```typescript
class Box<Type> {
  static defaultValue: Type;
  // Static members cannot reference class type parameters.
}
```

记住类型会被完全抹除，运行时，只有一个 Box.defaultValue 属性槽。这也意味着如果设置 Box<string>.defaultValue 是可以的话，这也会改变 Box<number>.defaultValue，而这样是不好的。

所以泛型类的静态成员不应该引用类的类型参数。

### 类运行时的 this（this at Runtime in Classes）

TypeScript 并不会更改 JavaScript 运行时的行为，并且 JavaScript 有时会出现一些奇怪的运行时行为。
就比如 JavaScript 处理 this 就很奇怪：

```typescript
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};

// Prints "obj", not "MyClass"
console.log(obj.getName());
```

默认情况下，函数中 this 的值取决于函数是如何被调用的。在这个例子中，因为函数通过 obj 被调用，所以 this 的值是 obj 而不是类实例。

这显然不是你所希望的。TypeScript 提供了一些方式缓解或者阻止这种错误。

#### 箭头函数（Arrow Functions）

如果你有一个函数，经常在被调用的时候丢失 this 上下文，使用一个箭头函数或许更好些。

```typescript
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
```

这里有几点需要注意下：

- this 的值在运行时是正确的，即使 TypeScript 不检查代码
- 这会使用更多的内存，因为每一个类实例都会拷贝一遍这个函数。
- 你不能在派生类使用 super.getName ，因为在原型链中并没有入口可以获取基类方法。

#### this 参数（this parameters）

在 TypeScript 方法或者函数的定义中，第一个参数且名字为 this 有特殊的含义。该参数会在编译的时候被抹除：

```typescript
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```javascript
// JavaScript output
function fn(x) {
  /* ... */
}
```

TypeScript 会检查一个有 this 参数的函数在调用时是否有一个正确的上下文。不像上个例子使用箭头函数，我们可以给方法定义添加一个 this 参数，静态强制方法被正确调用：

```typescript
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();

// Error, would crash
const g = c.getName;
console.log(g());
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'.
```

### this 类型（this Types）

在类中，有一个特殊的名为 this 的类型，会动态的引用当前类的类型，让我们看下它的用法：

```typescript
class Box {
  contents: string = "";
  set(value: string) {
    // (method) Box.set(value: string): this
    this.contents = value;
    return this;
  }
}
```

这里，TypeScript 推断 set 的返回类型为 this 而不是 Box 。让我们写一个 Box 的子类：

```typescript
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello");

// const b: ClearableBox
```

你也可以在参数类型注解中使用 this ：

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

不同于写 other: Box ，如果你有一个派生类，它的 sameAs 方法只接受来自同一个派生类的实例。

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
// Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
// Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.
```

#### 基于 this 的类型保护（this-based type guards）

你可以在类和接口的方法返回的位置，使用 this is Type 。当搭配使用类型收窄 (举个例子，if 语句)，目标对象的类型会被收窄为更具体的 Type。

```typescript
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
  fso.content;
  // const fso: FileRep
} else if (fso.isDirectory()) {
  fso.children;
  // const fso: Directory
} else if (fso.isNetworked()) {
  fso.host;
  // const fso: Networked & FileSystemObject
}
```

一个常见的基于 this 的类型保护的使用例子，会对一个特定的字段进行懒校验（lazy validation）。举个例子，在这个例子中，当 hasValue 被验证为 true 时，会从类型中移除 undefined：

```typescript
class Box<T> {
  value?: T;

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

const box = new Box();
box.value = "Gameboy";

box.value;
// (property) Box<unknown>.value?: unknown

if (box.hasValue()) {
  box.value;
  // (property) value: unknown
}
```

### 参数属性（Parameter Properties）

TypeScript 提供了特殊的语法，可以把一个构造函数参数转成一个同名同值的类属性。这些就被称为参数属性（parameter properties）。你可以通过在构造函数参数前添加一个可见性修饰符 public private protected 或者 readonly 来创建参数属性，最后这些类属性字段也会得到这些修饰符：

```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
// (property) Params.x: number

console.log(a.z);
// Property 'z' is private and only accessible within class 'Params'.
```

### 类表达式（Class Expressions）

类表达式跟类声明非常类似，唯一不同的是类表达式不需要一个名字，尽管我们可以通过绑定的标识符进行引用：

```typescript
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new someClass("Hello, world");
// const m: someClass<string>
```

### 抽象类和成员（abstract Classes and Members）

TypeScript 中，类、方法、字段都可以是抽象的（abstract）。

抽象方法或者抽象字段是不提供实现的。这些成员必须存在在一个抽象类中，这个抽象类也不能直接被实例化。

**抽象类的作用是作为子类的基类，让子类实现所有的抽象成员**。当一个类没有任何抽象成员，他就会被认为是具体的（concrete）。
让我们看个例子：

```typescript
abstract class Base {
  abstract getName(): string;
  printName() {
    console.log("hello" + this.getName());
  }
}
const b = new Base();
// Cannot create an instance of an abstract class.
```

我们不能使用 new 实例 Base 因为它是抽象类。我们需要写一个派生类，并且实现抽象成员。

```typescript
class Derived extends Base {
  getName() {
    return "world";
  }
}

const d = new Derived();
d.printName();
```

注意，如果我们忘记实现基类的抽象成员，我们会得到一个报错：

```typescript
class Derived extends Base {
  // Non-abstract class 'Derived' does not implement inherited abstract member 'getName' from class 'Base'.
  // forgot to do anything
}
```

#### 抽象构造签名（Abstract Construct Signatures）

有的时候，你希望接受传入可以继承一些抽象类产生一个类的实例的类构造函数。

```typescript
function greet(ctor: typeof Base) {
  const instance = new ctor();
  // Cannot create an instance of an abstract class.
  instance.printName();
}
```

TypeScript 会报错，告诉你正在尝试实例化一个抽象类。毕竟，根据 greet 的定义，这段代码应该是合法的：

```typescript
// Bad!
greet(Base);
```

但如果你写一个函数接受传入一个构造签名：

```typescript
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);

// Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'.
// Cannot assign an abstract constructor type to a non-abstract constructor type.
```

现在 TypeScript 会正确的告诉你，哪一个类构造函数可以被调用，Derived 可以，因为它是具体的，而 Base 是不能的。

### 类之间的关系（Relationships Between Classes）

大部分时候，TypeScript 的类跟其他类型一样，会被结构性比较。

举个例子，这两个类可以用于替代彼此，因为它们结构是相等的：

```typescript
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK
const p: Point1 = new Point2();
```

类似的还有，类的子类型之间可以建立关系，即使没有明显的继承：

```typescript
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK
const p: Person = new Employee();
```

空类没有任何成员。在一个结构化类型系统中，没有成员的类型通常是任何其他类型的父类型。所以如果你写一个空类（只是举例，你可不要这样做），任何东西都可以用来替换它：

```typescript
class Empty {}

function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}

// All OK!
fn(window);
fn({});
fn(fn);
```

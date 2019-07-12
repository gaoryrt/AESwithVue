# 算法规范
AES 算法中，**输入、输出块和状态块的长度均为 128 位**。这由$Nb = 4$ 表示，它反映了状态块中 32位/4字节（列）的个数。

AES 算法中，**密钥`K`的长度可选 128、192、256位**。这由$Nk = 4，6，8$ 表示，它反映了密钥中 32位/4字节（列）的个数。

AES 算法中，要执行的轮次数取决于密钥的长度。轮次数由$Nr$表示：$Nk = 4$ 时 $Nr = 10$、$Nk = 6$ 时 $Nr = 12$、$Nk = 8$ 时 $Nr = 14$。

**符合本标准的唯一密钥－轮组合给出如下表。** 有关密钥长度，块大小和轮次数的实现，请参见第
6.3章。

| |Key Length(Nk words)|Block Size (Nb words)|Number of Rounds(Nr)|
|:-:|:-:|:-:|:-:|
|AES-128|4|4|10|
|AES-192|6|4|12|
|AES-256|8|4|14|

AES算法的加解密都使用了由四个不同的字节转换函数组成的循环：

1. 使用替换表（S-box）进行字节替换
2. 对状态块的行进行不同的位移
3. 混合状态块中的每一列数据
4. 轮密钥相加

这些转换与逆转换参见第5.1.1-5.1.4和5.3.1－5.3.4章。

揭秘与解密参加第5.1章和5.3章，密码表见第5.2章。

## 5.1 加密
在加密开始时，使用3.4章描述的约定将输入复制到状态块。在初始的轮密钥相加之后，状态块将进行10／12／14次（由密钥长度决定）循环变换操作，最后一轮与第$Nr - 1$轮稍微不同。最后将状态块按3.4章所述复制到输出。

密钥扩展过程生成一维的四字节密钥块数组用于参数化循环函数，参见第5.2章。

加密过程参考下方伪代码。`SubBytes()`、`ShiftRows()`、`MixColumns()`、`AddRoundKey()`单独对状态块的变换操作参见后面几个小节。下方伪代码中的 $w[]$ 代表了扩展密钥，参见第5.2章。

正如伪代码中所述，除了最后一轮外的所有$Nr$轮都是相同的，最后一轮不包括`MixColumns()`变换。

附录B 提供了加密示例，显示了状态块在以下循环中每一轮四个变换开始与结束后的状态。

```
Cipher(byte in[4 * Nb], byte out[4 * Nb], word w[Nb * (Nr+1)])
begin
	byte state[4, Nb]
	state = in
	AddRoundKey(state, w[0, Nb-1]) // 参见5.1.4章
	for round = 1 step 1 to Nr–1
		SubBytes(state) // 参见5.1.1章
		ShiftRows(state) // 参见5.1.2章
		MixColumns(state) // 参见5.1.3章
		AddRoundKey(state, w[round * Nb, (round + 1) * Nb-1])
	end for
	SubBytes(state)
	ShiftRows(state)
	AddRoundKey(state, w[Nr * Nb, (Nr + 1) * Nb-1])
	out = state
end
```

### 5.1.1 `SubBytes()`字节替代

`SubBytes()`使用一个替换表（S盒）在状态块的每一个字节上进行独立、非线性的字节替换。S盒是可逆的，它由两个变换组合构建而成：

1. 取有限域$GF(2^8)$中的乘法逆，参考第4.2章。$\{0 0\}$元素映射到其自身。
2. 在$GF(2^8)$上使用以下仿射变换：

$$
{{b_i}^\prime}={b_i}\oplus{b_{(i+4)mod8}}\oplus{b_{(i+5)mod8}}\oplus{b_{(i+6)mod8}}\oplus{b_{(i+7)mod8}}\oplus{c_i}$$

对于 $0\le{i}\lt8$，其中 ${b_i}$ 是字节中的第 ${i^{th}}$ 位，${c_i}$ 是字节 $\{63\}$ 或 $\{01100011\}$ 的第 ${i^{th}}$ 位。

在本文中，带有角注的变量（例如 $b^\prime$）表示要用等号右侧的值更新该变量。

在矩阵中，S盒的仿射变换元素可以表示为：

$$
\begin{bmatrix}
{{b_0}^\prime}\\\
{{b_1}^\prime}\\\
{{b_2}^\prime}\\\
{{b_3}^\prime}\\\
{{b_4}^\prime}\\\
{{b_5}^\prime}\\\
{{b_6}^\prime}\\\
{{b_7}^\prime}\\\
\end{bmatrix}
=\begin{bmatrix}
1&0&0&0&1&1&1&1\\\
1&1&0&0&0&1&1&1\\\
1&1&1&0&0&0&1&1\\\
1&1&1&1&0&0&0&1\\\
1&1&1&1&1&0&0&0\\\
0&1&1&1&1&1&0&0\\\
0&0&1&1&1&1&1&0\\\
0&0&0&1&1&1&1&1\\\
\end{bmatrix}
\begin{bmatrix}
{b_0}\\\
{b_1}\\\
{b_2}\\\
{b_3}\\\
{b_4}\\\
{b_5}\\\
{b_6}\\\
{b_7}\\\
\end{bmatrix}+
\begin{bmatrix}
1\\\
1\\\
0\\\
0\\\
0\\\
1\\\
1\\\
0\\\
\end{bmatrix}$$

`SubBytes()`变换中使用的 S-box 以十六进制形式显示在下方。

例如，如果 ${s_{1,1}} = \{53\}$，则替换的值为索引$5$的行和索引$3$的列的交集。所以 ${{s^\prime}_{1,1}}$ 的值为 $\{ed\}$。

$$
\begin{matrix}
{}_x{}^y&|&y_0&y_1&y_2&y_3&y_4&y_5&y_6&y_7&y_8&y_9&y_a&y_b&y_c&y_d&y_e&y_f\\\
x_0&|&63&7c&77&7b&f2&6b&6f&c5&30&01&67&2b&fe&d7&ab&76\\\
x_1&|&ca&82&c9&7d&fa&59&47&f0&ad&d4&a2&af&9c&a4&72&c0\\\
x_2&|&b7&fd&93&26&36&3f&f7&cc&34&a5&e5&f1&71&d8&31&15\\\
x_3&|&04&c7&23&c3&18&96&05&9a&07&12&80&e2&eb&27&b2&75\\\
x_4&|&09&83&2c&1a&1b&6e&5a&a0&52&3b&d6&b3&29&e3&2f&84\\\
x_5&|&53&d1&00&ed&20&fc&b1&5b&6a&cb&be&39&4a&4c&58&cf\\\
x_6&|&d0&ef&aa&fb&43&4d&33&85&45&f9&02&7f&50&3c&9f&a8\\\
x_7&|&51&a3&40&8f&92&9d&38&f5&bc&b6&da&21&10&ff&f3&d2\\\
x_8&|&cd&0c&13&ec&5f&97&44&17&c4&a7&7e&3d&64&5d&19&73\\\
x_9&|&60&81&4f&dc&22&2a&90&88&46&ee&b8&14&de&5e&0b&db\\\
x_a&|&e0&32&3a&0a&49&06&24&5c&c2&d3&ac&62&91&95&e4&79\\\
x_b&|&e7&c8&37&6d&8d&d5&4e&a9&6c&56&f4&ea&65&7a&ae&08\\\
x_c&|&ba&78&25&2e&1c&a6&b4&c6&e8&dd&74&1f&4b&bd&8b&8a\\\
x_d&|&70&3e&b5&66&48&03&f6&0e&61&35&57&b9&86&c1&1d&9e\\\
x_e&|&e1&f8&98&11&69&d9&8e&94&9b&1e&87&e9&ce&55&28&df\\\
x_f&|&8c&a1&89&0d&bf&e6&42&68&41&99&2d&0f&b0&54&bb&16\\\
\end{matrix}$$

### 5.1.2 `ShiftRows()` 行位移变换
在 `ShiftRows()` 中，状态块的最后三行里的字节将会循环位移不同的字节（偏移量）。第一行 $r = 0$，不会进行位移。

`ShiftRows()` 变换的准确过程如下：

${{S^\prime}_{r,c}}={S_{(c+shift(r, Nb))mod Nb}}$ 其中 $0 \lt r \lt 4$ 且 $0 \le c \lt Nb$

其中偏移量 $shift(r, Nb)$ 由行数 $r$ 决定（默认 $Nb = 4$）：
$shift(1, 4)=1; shift(2, 4)=2; shift(3, 4)=3$

这会将字节移到行的较低位去，而最低位的字节会循环到行的最高位去。

### 5.1.3 `MixColumns()` 列混淆
`MixColumns()` 会对状态块的列进行操作，将每一列当作四项多项式。列被当做$GF(2^8)$上的多项式，以$x^4 + 1$ 的形式与多项式 $a(x)$相乘，多项式 $a(x)$给出如下：
$$a(x) = \{03\}x^3 + \{01\}x^2 + \{01\}x + \{02\}$$

这可以被写作多项式乘法，$s^\prime(x) = a(x) \oplus s(x)$:
 
$$\begin{bmatrix}
{s^\prime}_{0,c}\\\
{s^\prime}_{1,c}\\\
{s^\prime}_{2,c}\\\
{s^\prime}_{3,c}\\\
\end{bmatrix}=\begin{bmatrix}
02&03&01&01\\\
01&02&03&01\\\
01&01&02&03\\\
03&01&01&02\\\
\end{bmatrix}\begin{bmatrix}
s_{0,c}\\\
s_{1,c}\\\
s_{2,c}\\\
s_{3,c}\\\
\end{bmatrix}$$

其中 $0 \le c \lt Nb$

一列中四个字节多项式乘法的结果如下：
$${s^\prime}_{0,c}=(\{02\}\cdot s_{0,c})\oplus(\{03\}\cdot s_{1,c})\oplus s_{2,c}\oplus s_{3,c}$$
$${s^\prime}_{1,c}=s_{0,c}\oplus (\{02\}\cdot s_{1,c})\oplus(\{03\}\cdot s_{2,c})\oplus s_{3,c}$$
$${s^\prime}_{2,c}=s_{0,c}\oplus s_{1,c}\oplus(\{02\}\cdot s_{2,c})\oplus(\{03\}\cdot s_{3,c})$$
$${s^\prime}_{3,c}=(\{03\}\cdot s_{0,c})\oplus s_{1,c}\oplus s_{2,c}\oplus(\{02\}\cdot s_{3,c})$$

### 5.1.4 `AddRoundKey()` 轮密钥加
在`AddRoundKey()`中，轮密钥与状态块进行位上的异或运算。每一轮的轮密钥由扩展密钥中的$Nb$个字节构成。这$Nb$个字节分别被加到状态块的列上：
$$[{s^\prime}_{0,c},{s^\prime}_{1,c},{s^\prime}_{2,c},{s^\prime}_{3,c}]=[s_{0,c},s_{1,c},s_{2,c},s_{3,c}]\oplus[w_{round*Nb+c}]; 0\le c \lt Nb$$

其中$[w_i]$为扩展密钥字节， $round$ 为 $0 \le round \le Nr$ 的一个值。在加密中，$round = 0$时为初始化轮密钥，在此之前为第一轮函数。`AddRoundKey()`只会在$1 \le round \le Nr$时发生。


## 5.2 密钥扩展

AES 算法将初始密钥$K$经过密钥扩展过程生成扩展密钥。密钥扩展共产生$Nb(Br + 1)$字节：该算法需要一组初始密钥$Nb$字节，$Nr$轮中的每一轮都需要$Nb$字节的数据。扩展密钥的结果由$[w_i]$表示，包含了4字节的线性矩阵，且$0 \le i \lt Nb(Nr + 1)$。

将密钥扩展的过程可以参考下方伪代码。

`SubWord()`函数输入四字节，根据S盒输出对应的四个字节。`RotWord()`函数输入一个字节$[a_0, a_1, a_2, a_3]$，进行循环位移并输出$[a_1, a_2, a_3, a_0]$。轮的常数字节数组`Rcon[i]`的值为$[x^{i-1}, \{00\}, \{00\}, \{00\}]$，其中 $x^{i-1}$ 是 $GF(2^8)$ 域中的$x$ （$x$为$\{02\}$）的幂。（注意$i$从$1$开始而不是$0$）

在伪代码中可见首个$Nk$字节的扩展密钥是从密钥中来的。接下来的每一个`w[i]`都等于它的上一个字节`w[i - 1]`与之前的`Nk`位置的字节`w[i - Nk]`的异或值。在与$Nk$相乘的位置上，先进行一个$w[i - 1]$的异或，然后与轮`Rcon[i]`进行异或。这个变换在`RotWord()`上进行循环位移，然后在`SubWord()`上寻找所有四个字节。

需要注意的是，256位加密密钥（$Nk = 8$）与128位或192位的密钥都不一样。如果$Nk = 8$并且$i - 4$是$Nk$的倍数，那么`SubWord()`优先与`w[i - 1]`进行异或。



```
KeyExpansion(byte key[4*Nk], word w[Nb*(Nr+1)], Nk)
begin
    word temp
    i = 0
    while (i < Nk)
        w[i] = word(key[4*i], key[4*i+1], key[4*i+2], key[4*i+3])
        i = i+1
    end while
    i = Nk
    while (i < Nb * (Nr+1)]
        temp = w[i-1]
        if (i mod Nk = 0)
            temp = SubWord(RotWord(temp)) xor Rcon[i/Nk]
        else if (Nk > 6 and i mod Nk = 4)
            temp = SubWord(temp)
        end if
        w[i] = w[i-Nk] xor temp
        i = i + 1
    end while
end
```

## 5.3 解密
5.1中的加密可以反转，直接以相反的顺序运行，可以实现 AES 算法的解密。以下小节介绍了解密过程中的几个单独的函数 `InvShiftRows()`, `InvSubBytes()`, `InvMixColumns()`, `AddRoundKey()`。

下方的伪代码介绍了解密的过程，`w[]`是5.2节介绍的扩展密钥。

```
InvCipher(byte in[4*Nb], byte out[4*Nb], word w[Nb*(Nr+1)])
begin
    byte state[4,Nb]
    state = in
    AddRoundKey(state, w[Nr*Nb, (Nr+1)*Nb-1]) // 参见 5.1.4
    for round = Nr-1 step -1 downto 1
         InvShiftRows(state) // 参见 5.3.1
         InvSubBytes(state) // 参见 5.3.2
         AddRoundKey(state, w[round*Nb, (round+1)*Nb-1])
         InvMixColumns(state) // 参见 5.3.3
    end for
    InvShiftRows(state)
    InvSubBytes(state)
    AddRoundKey(state, w[0, Nb-1])
    out = state
end
```

### 5.3.1 `InvShiftRows()` 逆行位移

`InvShiftRows()`是`ShiftRows()`的逆。状态块最后三行的字节会被循环位移不同的字节。第一行 $r = 0$的内容不会被位移。最后三行循环位移的字节数为 $Nb-shift(r, Nb)$，其中$shift(r, Nb)$取决于行数，详见5.1.2章。

`InvShiftRows()`具体的实现如下：

${{S^\prime}_{r,(c+shift(r, Nb))mod Nb}}={S_{r,c}}$ 其中 $0 \lt r \lt 4$ 且 $0 \le c \lt Nb$
### 5.3.2 `InvSubBytes()` 逆字节替换

`InvSubBytes()`是字节替换的逆，逆S盒会替换状态块中的每个字节。$GF(2^8)$上的乘法逆的逆仿射变换即可实现该过程。

下方是`InvSubBytes()`使用的逆S盒：

| |0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|0|52|09|6a|d5|30|36|a5|38|bf|40|a3|9e|81|f3|d7|fb|
|1|7c|e3|39|82|9b|2f|ff|87|34|8e|43|44|c4|de|e9|cb|
|2|54|7b|94|32|a6|c2|23|3d|ee|4c|95|0b|42|fa|c3|4e|
|3|08|2e|a1|66|28|d9|24|b2|76|5b|a2|49|6d|8b|d1|25|
|4|72|f8|f6|64|86|68|98|16|d4|a4|5c|cc|5d|65|b6|92|
|5|6c|70|48|50|fd|ed|b9|da|5e|15|46|57|a7|8d|9d|84|
|6|90|d8|ab|00|8c|bc|d3|0a|f7|e4|58|05|b8|b3|45|06|
|7|d0|2c|1e|8f|ca|3f|0f|02|c1|af|bd|03|01|13|8a|6b|
|8|3a|91|11|41|4f|67|dc|ea|97|f2|cf|ce|f0|b4|e6|73|
|9|96|ac|74|22|e7|ad|35|85|e2|f9|37|e8|1c|75|df|6e|
|a|47|f1|1a|71|1d|29|c5|89|6f|b7|62|0e|aa|18|be|1b|
|b|fc|56|3e|4b|c6|d2|79|20|9a|db|c0|fe|78|cd|5a|f4|
|c|1f|dd|a8|33|88|07|c7|31|b1|12|10|59|27|80|ec|5f|
|d|60|51|7f|a9|19|b5|4a|0d|2d|e5|7a|9f|93|c9|9c|ef|
|e|a0|e0|3b|4d|ae|2a|f5|b0|c8|eb|bb|3c|83|53|99|61|
|f|17|2b|04|7e|ba|77|d6|26|e1|69|14|63|55|21|0c|7d|

### 5.3.3 `InvMixColumns()` 逆列混淆

`InvMixColumns()`是`MixColumns()`的逆。`InvMixColumns()` 会对状态块的列进行操作，将每一列当作四项多项式。列被当做$GF(2^8)$上的多项式，以$x^4 + 1$ 的形式与多项式 $a(x)$相乘，多项式 $a^{-1}(x)$给出如下：
$$a^{-1}(x) = \{0b\}x^3 + \{0d\}x^2 + \{09\}x + \{0e\}$$

这可以被写作多项式乘法，$s^\prime(x) = a^{-1}(x) \oplus s(x)$:
 
$$\begin{bmatrix}
{s^\prime}_{0,c}\\\
{s^\prime}_{1,c}\\\
{s^\prime}_{2,c}\\\
{s^\prime}_{3,c}\\\
\end{bmatrix}=\begin{bmatrix}
0e&0b&0d&09\\\
09&0e&0b&0d\\\
0d&09&0e&0b\\\
0b&0d&09&0e\\\
\end{bmatrix}\begin{bmatrix}
s_{0,c}\\\
s_{1,c}\\\
s_{2,c}\\\
s_{3,c}\\\
\end{bmatrix}$$

其中 $0 \le c \lt Nb$

一列中四个字节多项式乘法的结果如下：
$${s^\prime}_{0,c}=(\{0e\}\cdot s_{0,c})\oplus(\{0b\}\cdot s_{1,c})\oplus(\{0d\}\cdot s_{2,c})\oplus(\{09\}\cdot s_{3,c})$$
$${s^\prime}_{0,c}=(\{09\}\cdot s_{0,c})\oplus(\{0e\}\cdot s_{1,c})\oplus(\{0b\}\cdot s_{2,c})\oplus(\{0d\}\cdot s_{3,c})$$
$${s^\prime}_{0,c}=(\{0d\}\cdot s_{0,c})\oplus(\{09\}\cdot s_{1,c})\oplus(\{0e\}\cdot s_{2,c})\oplus(\{0b\}\cdot s_{3,c})$$
$${s^\prime}_{0,c}=(\{0b\}\cdot s_{0,c})\oplus(\{0d\}\cdot s_{1,c})\oplus(\{09\}\cdot s_{2,c})\oplus(\{0e\}\cdot s_{3,c})$$

### 5.3.4 `AddRoundKey()`的逆

`AddRoundKey()`在5.1.4章有过介绍，由于只涉及到异或操作，它的逆就是他自己。

### 5.3.5 等效解密

在5.3节中给出的直接解密顺序与加密不同，但是扩展密钥的形式相同。然而，AES算法中的几个函数都允许与之相同的变换作为等效解密。通过改变扩展密钥即可实现。

等效解密允许的两个属性如下：
1. `SubBytes()` 和 `ShiftRows()` 的交换： `SubBytes()` 之后进行 `ShiftRows()` 操作等效于先 `ShiftRows()` 再进行 `SubBytes()`。 `InvSubBytes()` 和 `InvShiftRows` 也同理。
2. 列混淆`MixColumns()`和`InvMixColumns()`相对于列输入是线性的，也就是说：$$InvMixColumns(state\ XOR\ Round\ Key) = InvMixColumns(state) XOR\  InvMixColumns(Round\ Key)$$

上述属性允许 `InvSubBytes()`和 `InvShiftRows()`变换的顺序
被反转。 使用`InvMixColumns()`变换扩展密钥的列（字节）之后，`AddRoundKey()`和 `InvMixColumns()`变换的顺序可以反转。

基于上述变化，可以得到效率更高的解密伪代码如下。（字节数组$dw[]$表示了变化后的扩展密钥。变化的过程也在下方伪代码里。）


```
EqInvCipher(byte in[4*Nb], byte out[4*Nb], word dw[Nb*(Nr+1)])
begin
    byte state[4,Nb]
    state = in
    AddRoundKey(state, dw[Nr*Nb, (Nr+1)*Nb-1])
    for round = Nr-1 step -1 downto 1
        InvSubBytes(state)
        InvShiftRows(state)
        InvMixColumns(state)
        AddRoundKey(state, dw[round*Nb, (round+1)*Nb-1])
    end for
    InvSubBytes(state)
    InvShiftRows(state)
    AddRoundKey(state, dw[0, Nb-1])
    out = state
end
```

下面是对扩展密钥进行的变换：

```
for i = 0 step 1 to (Nr+1)*Nb-1
    dw[i] = w[i]
end for
for round = 1 step 1 to Nr-1
    InvMixColumns(dw[round*Nb, (round+1)*Nb-1]) // note change of type
end for
```



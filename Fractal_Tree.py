START
--------
import random
from turtle import*

t=25                    
d=16                    
n=4                     

X="F-[[X]+X]+F[+FX]-X"  
F="F"

stack=[]
foo=['green','red']

def x(n):
    if n>0: L(X,n)
    else:   dot(10, random.choice(foo))
    
def f(n):
    if n>0: L(F,n)
    
def L(s,n):
    pensize(n*2)
    for c in s:

#        if   c=='-':    lt(gauss(t,t))
#        elif c=='+':    rt(gauss(t,t))
        if   c=='-':    lt(t)
        elif c=='+':    rt(t)
        elif c=='X':    x(n-1)
        elif c=='F':    f(n-1);fd(d)
        elif c=='[':    stack.append((pos(),heading(),n))
        elif c==']': 
            ((i,j),h,p)=stack.pop()
            penup()
            goto(i,j)
            seth(h)
            pensize(p)
            pendown()

penup()
goto(0,-200)
pendown()
seth(90)
color('brown','green')
x(n)
------
ENDE

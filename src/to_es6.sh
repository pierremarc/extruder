#!/bin/bash
TRANSFORMS=(no-strict let class  arrow  for-of  arg-spread  obj-method  obj-shorthand  commonjs  multi-var  template default-param)
# TRANSFORMS=(let)
for T in ${TRANSFORMS[@]}
do
    lebab --replace $1 -t ${T}
done

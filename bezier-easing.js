/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */
!function(r){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=r();else if("function"==typeof define&&define.amd)define([],r);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).BezierEasing=r()}}(function(){return function f(u,i,a){function c(n,r){if(!i[n]){if(!u[n]){var e="function"==typeof require&&require;if(!r&&e)return e(n,!0);if(d)return d(n,!0);var t=new Error("Cannot find module '"+n+"'");throw t.code="MODULE_NOT_FOUND",t}var o=i[n]={exports:{}};u[n][0].call(o.exports,function(r){return c(u[n][1][r]||r)},o,o.exports,f,u,i,a)}return i[n].exports}for(var d="function"==typeof require&&require,r=0;r<a.length;r++)c(a[r]);return c}({1:[function(r,n,e){var a=4,c=1e-7,d=10,o="function"==typeof Float32Array;function t(r,n){return 1-3*n+3*r}function f(r,n){return 3*n-6*r}function u(r){return 3*r}function l(r,n,e){return((t(n,e)*r+f(n,e))*r+u(n))*r}function p(r,n,e){return 3*t(n,e)*r*r+2*f(n,e)*r+u(n)}function s(r){return r}n.exports=function(f,n,u,e){if(!(0<=f&&f<=1&&0<=u&&u<=1))throw new Error("bezier x values must be in [0, 1] range");if(f===n&&u===e)return s;for(var i=o?new Float32Array(11):new Array(11),r=0;r<11;++r)i[r]=l(.1*r,f,u);function t(r){for(var n=0,e=1;10!==e&&i[e]<=r;++e)n+=.1;var t=n+.1*((r-i[--e])/(i[e+1]-i[e])),o=p(t,f,u);return.001<=o?function(r,n,e,t){for(var o=0;o<a;++o){var f=p(n,e,t);if(0===f)return n;n-=(l(n,e,t)-r)/f}return n}(r,t,f,u):0===o?t:function(r,n,e,t,o){for(var f,u,i=0;0<(f=l(u=n+(e-n)/2,t,o)-r)?e=u:n=u,Math.abs(f)>c&&++i<d;);return u}(r,n,n+.1,f,u)}return function(r){return 0===r?0:1===r?1:l(t(r),n,e)}}},{}]},{},[1])(1)});

<?php
// Stubs mínimos de WordPress para probar el fragmento fuera de la web.
define('DAY_IN_SECONDS',86400); define('HOUR_IN_SECONDS',3600); define('COOKIEPATH','/'); define('COOKIE_DOMAIN','');
$GLOBALS['_t']=array(); $GLOBALS['_f']=array();
function add_filter(){} function add_action(){} function register_rest_route(){}
function get_transient($k){ return $GLOBALS['_t'][$k] ?? false; } function set_transient($k,$v,$e){ $GLOBALS['_t'][$k]=$v; return true; }
function is_user_logged_in(){ return true; } function current_user_can(){ return true; } function wp_salt($s=''){ return 'sal'.$s; }
function wp_date($f){ return date($f); } function home_url($p=''){ return 'https://sergiolearns.com'.$p; }
function strip_shortcodes($s){ return $s; } function wp_check_invalid_utf8($s){ return $s; } function absint($n){ return abs((int)$n); }
function wp_json_encode($d,$o=0){ return json_encode($d,$o); } function wp_parse_url($u,$c=-1){ return parse_url($u,$c); }
function get_permalink($p){ return 'https://sergiolearns.com/punteros-en-c/'; } function get_the_title($p){ return 'Punteros en C'; }
function wp_strip_all_tags($s){ return strip_tags($s); } function is_wp_error($x){ return false; }
function wp_get_post_terms($id,$tax,$a=array()){ return $tax==='tipo' ? array('Teoría') : array(); }
function get_term_link($t){ return 'x'; } function get_posts($a){ return array(); } function has_term(){ return false; }
function get_post($p){ return is_object($p)?$p:null; }

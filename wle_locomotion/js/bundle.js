//WLE

require('@wonderlandengine/components/8thwall-camera');
require('@wonderlandengine/components/cursor-target');
require('@wonderlandengine/components/cursor');
require('@wonderlandengine/components/debug-object');
require('@wonderlandengine/components/device-orientation-look');
require('@wonderlandengine/components/finger-cursor');
require('@wonderlandengine/components/fixed-foveation');
require('@wonderlandengine/components/hand-tracking');
require('@wonderlandengine/components/hit-test-location');
require('@wonderlandengine/components/howler-audio-listener');
require('@wonderlandengine/components/howler-audio-source');
require('@wonderlandengine/components/image-texture');
require('@wonderlandengine/components/mouse-look');
//require('@wonderlandengine/components/player-height');
require('@wonderlandengine/components/target-framerate');
require('@wonderlandengine/components/teleport');
require('@wonderlandengine/components/two-joint-ik-solver');
require('@wonderlandengine/components/video-texture');
require('@wonderlandengine/components/vr-mode-active-switch');
require('@wonderlandengine/components/wasd-controls');
require('@wonderlandengine/components/wonderleap-ad');

//PP

require('./pp/pp');

//	PLUGIN
require('./pp/plugin/component_mods/clone_component_mod');
require('./pp/plugin/component_mods/cursor_component_mod');
require('./pp/plugin/component_mods/cursor_target_component_mod');
require('./pp/plugin/component_mods/mouse_look_component_mod');

require('./pp/plugin/extensions/array_extension');
require('./pp/plugin/extensions/object_extension');
require('./pp/plugin/extensions/math_extension');

//	AUDIO
require('./pp/audio/spatial_audio_listener');
require('./pp/audio/audio_manager_component');
require('./pp/audio/audio_manager');
require('./pp/audio/audio_player');
require('./pp/audio/audio_setup');
require('./pp/audio/mute_all');

//	CAULDRON
require('./pp/cauldron/benchmarks/max_physx');
require('./pp/cauldron/benchmarks/max_visible_triangles');

require('./pp/cauldron/cauldron/number_over_value');
require('./pp/cauldron/cauldron/object_pool_manager');
require('./pp/cauldron/cauldron/physx_collision_collector');
require('./pp/cauldron/cauldron/save_manager');
require('./pp/cauldron/cauldron/timer');

require('./pp/cauldron/components/clear_console_on_session');
require('./pp/cauldron/components/set_active');
require('./pp/cauldron/components/adjust_hierarchy_physx_scale');
require('./pp/cauldron/components/get_player_objects');
require('./pp/cauldron/components/get_default_resources');

require('./pp/cauldron/fsm/fsm');
require('./pp/cauldron/fsm/state');
require('./pp/cauldron/fsm/transition');
require('./pp/cauldron/fsm/states/timer_state');

require('./pp/cauldron/utils/ca_utils');
require('./pp/cauldron/utils/color_utils');
require('./pp/cauldron/utils/mesh_utils');
require('./pp/cauldron/utils/save_utils');
require('./pp/cauldron/utils/text_utils');
require('./pp/cauldron/utils/xr_utils');

require('./pp/cauldron/physics/physics_utils');
require('./pp/cauldron/physics/physics_raycast_data');
require('./pp/cauldron/physics/physics_layer_flags');

require('./pp/cauldron/visual/visual_manager');

require('./pp/cauldron/visual/elements/visual_element_types');
require('./pp/cauldron/visual/elements/visual_line');
require('./pp/cauldron/visual/elements/visual_mesh');
require('./pp/cauldron/visual/elements/visual_point');
require('./pp/cauldron/visual/elements/visual_arrow');
require('./pp/cauldron/visual/elements/visual_text');
require('./pp/cauldron/visual/elements/visual_transform');
require('./pp/cauldron/visual/elements/visual_raycast');
require('./pp/cauldron/visual/elements/visual_torus');

require('./pp/cauldron/visual/components/visual_manager_component');

//	DEBUG
require('./pp/debug/debug_manager');
require('./pp/debug/debug_visual_manager');

require('./pp/debug/components/debug_transform_component');
require('./pp/debug/components/debug_manager_component');

//	GAMEPLAY
require('./pp/gameplay/cauldron/direction_2D_to_3D_converter');

require('./pp/gameplay/grab_throw/grabbable');
require('./pp/gameplay/grab_throw/grabber_hand');

//	INPUT
require('./pp/input/cauldron/finger_cursor');
require('./pp/input/cauldron/input_types');
require('./pp/input/cauldron/input_utils');
require('./pp/input/cauldron/keyboard');
require('./pp/input/cauldron/mouse');
require('./pp/input/cauldron/input_manager');
require('./pp/input/cauldron/input_manager_component');
require('./pp/input/cauldron/switch_hand_object');
require('./pp/input/cauldron/tracked_hand_draw_joint');
require('./pp/input/cauldron/tracked_hand_draw_all_joints');
require('./pp/input/cauldron/tracked_hand_draw_skin');

require('./pp/input/gamepad/gamepad_buttons');
require('./pp/input/gamepad/base_gamepad');
require('./pp/input/gamepad/universal_gamepad');
require('./pp/input/gamepad/gamepad_cores/gamepad_core');
require('./pp/input/gamepad/gamepad_cores/xr_gamepad_core');
require('./pp/input/gamepad/gamepad_cores/keyboard_gamepad_core');
require('./pp/input/gamepad/cauldron/gamepad_animator');
require('./pp/input/gamepad/cauldron/gamepad_manager');
require('./pp/input/gamepad/cauldron/gamepad_utils');
require('./pp/input/gamepad/cauldron/gamepad_control_scheme');

require('./pp/input/pose/base_pose.js');
require('./pp/input/pose/hand_pose');
require('./pp/input/pose/head_pose');
require('./pp/input/pose/tracked_hand_joint_pose');
require('./pp/input/pose/tracked_hand_pose');
require('./pp/input/pose/components/set_player_height');
require('./pp/input/pose/components/set_hand_local_transform');
require('./pp/input/pose/components/set_head_local_transform');
require('./pp/input/pose/components/set_vr_head_local_transform');
require('./pp/input/pose/components/set_non_vr_head_local_transform');
require('./pp/input/pose/components/copy_hand_transform');
require('./pp/input/pose/components/copy_head_transform');

//	TOOL
require('./pp/tool/cauldron/cauldron/tool_types');
require('./pp/tool/cauldron/components/tool_cursor');

require('./pp/tool/console_vr/console_vr_widget_setup');
require('./pp/tool/console_vr/console_vr_widget_ui');
require('./pp/tool/console_vr/console_vr_widget');
require('./pp/tool/console_vr/console_vr');

require('./pp/tool/easy_tune/easy_object_tuners/easy_object_tuner');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_attenuation');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_color');
require('./pp/tool/easy_tune/easy_object_tuners/easy_mesh_color');
require('./pp/tool/easy_tune/easy_object_tuners/easy_scale');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_child_number');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_grab');
require('./pp/tool/easy_tune/easy_object_tuners/easy_transform');

require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget_setup');

require('./pp/tool/easy_tune/easy_tune_variables');
require('./pp/tool/easy_tune/easy_tune');

require('./pp/tool/widget_frame/widget_frame_setup');
require('./pp/tool/widget_frame/widget_frame_ui');
require('./pp/tool/widget_frame/widget_frame');

//CAULDRON

require('./cauldron/toggle_require_mouse_down');
require('./cauldron/character_spawner');
require('./cauldron/ai_movement');
require('./cauldron/stick_movement');
require('./cauldron/display_fps');

//LOCOMOTION

require('./locomotion/locomotion_utils');
require('./locomotion/collision/collision_params');
require('./locomotion/collision/collision_check');
require('./locomotion/collision/collision_movement_check');
require('./locomotion/collision/collision_teleport_check');
require('./locomotion/collision/horizontal_collision_check');
require('./locomotion/collision/horizontal_collision_sliding');
require('./locomotion/collision/horizontal_collision_movement_check');
require('./locomotion/collision/horizontal_collision_position_check');
require('./locomotion/collision/vertical_collision_check');
require('./locomotion/collision/collision_surface_check');
require('./locomotion/player_head_manager');
require('./locomotion/player_locomotion_rotate');
require('./locomotion/player_locomotion_movement');
require('./locomotion/player_locomotion_smooth');
require('./locomotion/player_locomotion');
require('./locomotion/player_locomotion_component');

require('./locomotion/teleport/player_locomotion_teleport_parable');
require('./locomotion/teleport/player_locomotion_teleport_state');
require('./locomotion/teleport/player_locomotion_teleport_detection_visualizer');
require('./locomotion/teleport/player_locomotion_teleport_detection_state');
require('./locomotion/teleport/player_locomotion_teleport_detection_state_visibility');
require('./locomotion/teleport/player_locomotion_teleport_teleport_state');
require('./locomotion/teleport/player_locomotion_teleport');

require('./locomotion/draft/locomotion_draft');
require('./locomotion/draft/locomotion_draft_2');
require('./locomotion/draft/locomotion_fly_draft');
require('./locomotion/draft/locomotion_floating_error');

//TEST

require('./test/raycast_test');
require('./test/moving_physx_test');
require('./test/bullet_through_wall_test');
require('./test/reset_transform');
require('./test/touch_start_test');
require('./test/vec_create_count');
require('./test/vec3_function_count');
require('./test/show_line_test');
require('./test/inverted_sphere');
require('./test/show_torus');
require('./test/toggle_active');
require('./test/test_tracked_hand_draw_joints');
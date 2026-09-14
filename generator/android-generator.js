export function generateAndroidProject(project = 'My ARK App', nodes = [], edges = []) {
  const safe = String(project).replace(/[^a-zA-Z0-9]+/g, '').replace(/^\d+/, '') || 'ArkApp';
  const pkg = `com.ark.generated.${safe.toLowerCase()}`;
  const views = nodes.map((n, i) => {
    const p = n.props || {};
    switch (n.type) {
      case 'Text': return `<TextView android:id="@+id/text_${i}" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="${escapeXml(p.text || '')}" />`;
      case 'Button': return `<Button android:id="@+id/button_${i}" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="${escapeXml(p.text || 'Button')}" />`;
      case 'Input': return `<EditText android:id="@+id/input_${i}" android:layout_width="match_parent" android:layout_height="wrap_content" android:hint="${escapeXml(p.hint || '')}" />`;
      case 'Image': return `<ImageView android:id="@+id/image_${i}" android:layout_width="wrap_content" android:layout_height="wrap_content" android:contentDescription="ARK Image" />`;
      case 'Switch': return `<Switch android:id="@+id/switch_${i}" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Switch" />`;
      default: return '';
    }
  }).filter(Boolean).join('\n        ');

  const permissions = [...new Set(nodes.flatMap(n => permissionFor(n.type)))];
  const manifestPermissions = permissions.map(p => `    <uses-permission android:name="android.permission.${p}" />`).join('\n');
  const activity = `package ${pkg};\n\nimport android.app.Activity;\nimport android.os.Bundle;\nimport android.widget.LinearLayout;\n\npublic class MainActivity extends Activity {\n  @Override public void onCreate(Bundle state) {\n    super.onCreate(state);\n    LinearLayout root = new LinearLayout(this);\n    root.setOrientation(LinearLayout.VERTICAL);\n    root.setPadding(24,24,24,24);\n    setContentView(root);\n  }\n}`;

  return {
    project,
    packageName: pkg,
    files: {
      'app/src/main/java/com/ark/generated/MainActivity.java': activity,
      'app/src/main/res/layout/activity_main.xml': `<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical" android:padding="24dp">\n        ${views}\n      </LinearLayout>`,
      'app/src/main/AndroidManifest.xml': `<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n${manifestPermissions}\n    <application android:theme="@style/AppTheme" android:label="${escapeXml(project)}">\n      <activity android:name=".MainActivity" android:exported="true">\n        <intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter>\n      </activity>\n    </application>\n</manifest>`,
      'ark/graph.json': JSON.stringify({schema:'ark-project',version:3,project,nodes,edges}, null, 2)
    }
  };
}

function permissionFor(type) {
  if (type === 'Camera' || type === 'AI Vision' || type === 'Object Detector') return ['CAMERA'];
  if (type === 'Microphone') return ['RECORD_AUDIO'];
  if (type === 'GPS') return ['ACCESS_FINE_LOCATION'];
  if (type === 'Bluetooth') return ['BLUETOOTH_CONNECT','BLUETOOTH_SCAN'];
  return [];
}
function escapeXml(value) { return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

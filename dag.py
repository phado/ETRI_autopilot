from airflow import DAG
from datetime import datetime, timedelta
from airflow.contrib.operators.kubernetes_pod_operator import KubernetesPodOperator
from airflow.operators.dummy_operator import DummyOperator
from kubernetes.client import models as k8s
#from airflow.providers.cncf.kubernetes.backcompat.volume import Volume
#from airflow.providers.cncf.kubernetes.backcompat.volume_mount import VolumeMount


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime.utcnow(),
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0,
    'retry_delay': timedelta(minutes=5)
}

pvc_name = "jinpung-train-data"
volume_mount_path = "/data/fmea-test/result"

volume_mount = k8s.V1VolumeMount(
    name=pvc_name, mount_path=volume_mount_path , sub_path=None, read_only=False
)

volume = k8s.V1Volume(
    name=pvc_name,
    persistent_volume_claim=k8s.V1PersistentVolumeClaimVolumeSource(claim_name=pvc_name),
)


dag = DAG('data-train', default_args=default_args, schedule_interval="@weekly")

first_task = DummyOperator(task_id='dataset-task', dag=dag)

node_affinity = {
    'nodeAffinity': {
        'requiredDuringSchedulingIgnoredDuringExecution': {
            'nodeSelectorTerms': [{
                'matchExpressions': [{
                    'key': 'kubernetes.io/hostname',
                    'operator': 'In',
                    'values': ['devel-server']
                }]
            }]
        }
    }
}

''' Train arguments
{
  "mlflow_ip" : *,
  "train_img" : *,
  "train_batch" : *,
  "train_epochs" : *,
  "minio_ip" : *,
  "minio_id" : *,
  "minio_pw" : *,
}
'''


second_task = KubernetesPodOperator(
    namespace='jinpung',
    image="traindata:0.1",
    cmds=["bash", "-c"],
    arguments=[
        'python train.py'
    ],
    labels={"foo": "bar"},
    name="python-k8s-task",
    task_id="train-task",
    get_logs=True,
    volumes=[volume],
    volume_mounts=[volume_mount],
    affinity=node_affinity,
    dag=dag
)
first_task >> second_task 

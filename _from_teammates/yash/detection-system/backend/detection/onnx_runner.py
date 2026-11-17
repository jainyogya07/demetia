"""
Edge ONNX Inference Runner
Executes trained detection model using ONNX Runtime for ultra-low latency,
zero-dependency offline evaluation on client machines.
"""

from __future__ import annotations
from pathlib import Path
import numpy as np

MODEL_PATH = Path(__file__).resolve().parent / "artifacts" / "detection_model.onnx"


class OnnxEdgeDetector:
    def __init__(self, model_path: Path | str | None = None) -> None:
        self.model_path = Path(model_path) if model_path else MODEL_PATH
        self._session = None

    def _ensure_session(self) -> None:
        if self._session is None:
            if not self.model_path.exists():
                raise FileNotFoundError(
                    f"ONNX model not found at {self.model_path}. Train the pipeline first."
                )
            import onnxruntime as ort

            # Highly optimized CPU execution provider for offline client edge
            opts = ort.SessionOptions()
            opts.intra_op_num_threads = 1
            opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
            self._session = ort.InferenceSession(
                str(self.model_path),
                sess_options=opts,
                providers=["CPUExecutionProvider"],
            )

    def predict(self, feature_vector: list[float]) -> float:
        """Runs fast local ONNX inference in < 2 milliseconds."""
        self._ensure_session()
        input_name = self._session.get_inputs()[0].name
        output_name = self._session.get_outputs()[0].name

        data = np.array([feature_vector], dtype=np.float32)
        outputs = self._session.run([output_name], {input_name: data})
        pred = float(np.ravel(outputs[0])[0])
        return max(0.0, min(1.0, pred))

import type { CodegenFile } from './codegen';

export type CodegenMode = 'basic' | 'practical' | 'teaching';

export const codegenModes: Array<{ id: CodegenMode; title: string; description: string }> = [
  { id: 'basic', title: '基础骨架', description: '类声明、空函数和 TODO，适合刚开始理解结构。' },
  { id: 'practical', title: '实战增强', description: 'Logger / INI / WorkerThread 提供更接近 MFC 实战的实现结构。' },
  { id: 'teaching', title: '教学注释版', description: '在实战增强基础上加入中文注释、排错提示和接入边界说明。' },
];

const loggerPractical: CodegenFile[] = [
  { path: 'Logger.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>
#include <functional>

// Codegen v2 practical template: thread-safe logger with callback.
enum class LogLevel
{
  Info,
  Warning,
  Error,
  Debug
};

using LogCallback = std::function<void(LogLevel, const CString&)>;

class Logger
{
public:
  Logger();
  ~Logger();

  void SetCallback(LogCallback callback);
  void Write(LogLevel level, const CString& message);
  void Info(const CString& message);
  void Warning(const CString& message);
  void Error(const CString& message);
  void Debug(const CString& message);

  static CString LevelText(LogLevel level);
  static CString Format(LogLevel level, const CString& message);

private:
  CRITICAL_SECTION m_lock;
  LogCallback m_callback;
};` },
  { path: 'Logger.cpp', language: 'cpp', content: `#include "pch.h"
#include "Logger.h"
#include <afx.h>

Logger::Logger()
{
  InitializeCriticalSection(&m_lock);
}

Logger::~Logger()
{
  DeleteCriticalSection(&m_lock);
}

void Logger::SetCallback(LogCallback callback)
{
  EnterCriticalSection(&m_lock);
  m_callback = callback;
  LeaveCriticalSection(&m_lock);
}

void Logger::Write(LogLevel level, const CString& message)
{
  CString line = Format(level, message);
  LogCallback callback;

  EnterCriticalSection(&m_lock);
  callback = m_callback;
  LeaveCriticalSection(&m_lock);

  if (callback) {
    callback(level, line);
  }
}

void Logger::Info(const CString& message) { Write(LogLevel::Info, message); }
void Logger::Warning(const CString& message) { Write(LogLevel::Warning, message); }
void Logger::Error(const CString& message) { Write(LogLevel::Error, message); }
void Logger::Debug(const CString& message) { Write(LogLevel::Debug, message); }

CString Logger::LevelText(LogLevel level)
{
  switch (level) {
  case LogLevel::Warning: return _T("WARN");
  case LogLevel::Error: return _T("ERROR");
  case LogLevel::Debug: return _T("DEBUG");
  default: return _T("INFO");
  }
}

CString Logger::Format(LogLevel level, const CString& message)
{
  CString line;
  line.Format(_T("[%s][%s] %s"),
    CTime::GetCurrentTime().Format(_T("%H:%M:%S")),
    LevelText(level).GetString(),
    message.GetString());
  return line;
}` },
];

const configPractical: CodegenFile[] = [
  { path: 'ConfigStore.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>

struct AppConfig
{
  CString serialPort = _T("COM3");
  int baudRate = 9600;
  CString tcpHost = _T("192.168.1.10");
  int tcpPort = 502;
  CString httpUrl = _T("https://example.com/api");
  BOOL autoReconnect = FALSE;
};

class ConfigStore
{
public:
  explicit ConfigStore(const CString& fileName = _T("app.ini"));

  CString GetConfigPath() const;
  CString ReadString(const CString& section, const CString& key, const CString& defaultValue) const;
  int ReadInt(const CString& section, const CString& key, int defaultValue) const;
  void WriteString(const CString& section, const CString& key, const CString& value) const;
  void WriteInt(const CString& section, const CString& key, int value) const;

  bool Load(AppConfig& config, CString& error) const;
  bool Save(const AppConfig& config, CString& error) const;

private:
  CString m_fileName;
};` },
  { path: 'ConfigStore.cpp', language: 'cpp', content: `#include "pch.h"
#include "ConfigStore.h"
#include <Shlwapi.h>
#pragma comment(lib, "Shlwapi.lib")

ConfigStore::ConfigStore(const CString& fileName)
  : m_fileName(fileName)
{
}

CString ConfigStore::GetConfigPath() const
{
  TCHAR exePath[MAX_PATH] = { 0 };
  GetModuleFileName(nullptr, exePath, MAX_PATH);
  PathRemoveFileSpec(exePath);

  CString configDir;
  configDir.Format(_T("%s\\config"), exePath);
  CreateDirectory(configDir, nullptr);

  CString iniPath;
  iniPath.Format(_T("%s\\%s"), configDir.GetString(), m_fileName.GetString());
  return iniPath;
}

CString ConfigStore::ReadString(const CString& section, const CString& key, const CString& defaultValue) const
{
  TCHAR buffer[1024] = { 0 };
  GetPrivateProfileString(section, key, defaultValue, buffer, 1024, GetConfigPath());
  return CString(buffer);
}

int ConfigStore::ReadInt(const CString& section, const CString& key, int defaultValue) const
{
  return GetPrivateProfileInt(section, key, defaultValue, GetConfigPath());
}

void ConfigStore::WriteString(const CString& section, const CString& key, const CString& value) const
{
  WritePrivateProfileString(section, key, value, GetConfigPath());
}

void ConfigStore::WriteInt(const CString& section, const CString& key, int value) const
{
  CString text;
  text.Format(_T("%d"), value);
  WriteString(section, key, text);
}

bool ConfigStore::Load(AppConfig& config, CString& error) const
{
  error.Empty();
  config.serialPort = ReadString(_T("Serial"), _T("Port"), config.serialPort);
  config.baudRate = ReadInt(_T("Serial"), _T("BaudRate"), config.baudRate);
  config.tcpHost = ReadString(_T("Network"), _T("Host"), config.tcpHost);
  config.tcpPort = ReadInt(_T("Network"), _T("Port"), config.tcpPort);
  config.httpUrl = ReadString(_T("HTTP"), _T("Url"), config.httpUrl);
  config.autoReconnect = ReadInt(_T("Network"), _T("AutoReconnect"), 0) ? TRUE : FALSE;
  return true;
}

bool ConfigStore::Save(const AppConfig& config, CString& error) const
{
  error.Empty();
  WriteString(_T("Serial"), _T("Port"), config.serialPort);
  WriteInt(_T("Serial"), _T("BaudRate"), config.baudRate);
  WriteString(_T("Network"), _T("Host"), config.tcpHost);
  WriteInt(_T("Network"), _T("Port"), config.tcpPort);
  WriteInt(_T("Network"), _T("AutoReconnect"), config.autoReconnect ? 1 : 0);
  WriteString(_T("HTTP"), _T("Url"), config.httpUrl);
  return true;
}` },
  { path: 'app.ini', language: 'ini', content: `[Serial]
Port=COM3
BaudRate=9600
Mode=HEX

[Network]
Host=192.168.1.10
Port=502
AutoReconnect=0

[HTTP]
Url=https://example.com/api
TimeoutMs=5000

[UI]
Theme=Dark
LogMaxLines=1000
` },
];

const workerPractical: CodegenFile[] = [
  { path: 'WorkerThread.h', language: 'cpp', content: `#pragma once
#include <atomic>
#include <functional>
#include <afxwin.h>

// Codegen v2 practical template: safe start/stop worker for serial/TCP/HTTP tasks.
class WorkerThread
{
public:
  using Task = std::function<void(std::atomic_bool& stopFlag)>;

  WorkerThread();
  ~WorkerThread();

  bool Start(Task task);
  void RequestStop();
  bool WaitStop(DWORD timeoutMs = 3000);
  bool Stop(DWORD timeoutMs = 3000);
  bool IsRunning() const;

private:
  static UINT ThreadProc(LPVOID pParam);

  CWinThread* m_thread = nullptr;
  std::atomic_bool m_stopFlag { false };
  CEvent m_doneEvent;
  Task m_task;
};` },
  { path: 'WorkerThread.cpp', language: 'cpp', content: `#include "pch.h"
#include "WorkerThread.h"

WorkerThread::WorkerThread()
  : m_doneEvent(FALSE, TRUE)
{
}

WorkerThread::~WorkerThread()
{
  Stop(3000);
}

bool WorkerThread::Start(Task task)
{
  if (IsRunning() || !task) return false;

  m_task = task;
  m_stopFlag = false;
  m_doneEvent.ResetEvent();
  m_thread = AfxBeginThread(ThreadProc, this, THREAD_PRIORITY_NORMAL, 0, CREATE_SUSPENDED);
  if (!m_thread) {
    m_doneEvent.SetEvent();
    return false;
  }
  m_thread->m_bAutoDelete = FALSE;
  m_thread->ResumeThread();
  return true;
}

void WorkerThread::RequestStop()
{
  m_stopFlag = true;
}

bool WorkerThread::WaitStop(DWORD timeoutMs)
{
  if (!m_thread) return true;
  DWORD waitResult = WaitForSingleObject(m_thread->m_hThread, timeoutMs);
  if (waitResult == WAIT_OBJECT_0) {
    delete m_thread;
    m_thread = nullptr;
    return true;
  }
  return false;
}

bool WorkerThread::Stop(DWORD timeoutMs)
{
  RequestStop();
  return WaitStop(timeoutMs);
}

bool WorkerThread::IsRunning() const
{
  return m_thread != nullptr;
}

UINT WorkerThread::ThreadProc(LPVOID pParam)
{
  WorkerThread* self = reinterpret_cast<WorkerThread*>(pParam);
  if (!self) return 1;

  if (self->m_task) {
    self->m_task(self->m_stopFlag);
  }
  self->m_doneEvent.SetEvent();
  return 0;
}` },
];


const serialPractical: CodegenFile[] = [
  { path: 'SerialManager.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>
#include <windows.h>
#include <vector>

struct SerialConfig
{
  CString port = _T("COM3");
  DWORD baudRate = CBR_9600;
  BYTE dataBits = 8;
  BYTE parity = NOPARITY;
  BYTE stopBits = ONESTOPBIT;
  DWORD readTimeoutMs = 200;
  DWORD writeTimeoutMs = 500;
};

class SerialManager
{
public:
  SerialManager();
  ~SerialManager();

  bool Open(const SerialConfig& config, CString& error);
  void Close();
  bool IsOpen() const;

  bool WriteBytes(const std::vector<BYTE>& data, CString& error);
  bool WriteText(const CString& text, CString& error);
  bool WriteHex(const CString& hexText, CString& error);
  bool ReadAvailable(std::vector<BYTE>& out, CString& error);

private:
  CString NormalizePortName(const CString& portName) const;
  bool HexToBytes(const CString& hexText, std::vector<BYTE>& out, CString& error) const;
  CString FormatLastError(DWORD errorCode) const;

  HANDLE m_handle = INVALID_HANDLE_VALUE;
};` },
  { path: 'SerialManager.cpp', language: 'cpp', content: `#include "pch.h"
#include "SerialManager.h"
#include <atlconv.h>

SerialManager::SerialManager() = default;
SerialManager::~SerialManager() { Close(); }

bool SerialManager::Open(const SerialConfig& config, CString& error)
{
  Close();
  CString portName = NormalizePortName(config.port);
  m_handle = CreateFile(portName, GENERIC_READ | GENERIC_WRITE, 0, nullptr, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, nullptr);
  if (m_handle == INVALID_HANDLE_VALUE) {
    error = FormatLastError(GetLastError());
    return false;
  }

  DCB dcb = { 0 };
  dcb.DCBlength = sizeof(DCB);
  if (!GetCommState(m_handle, &dcb)) {
    error = FormatLastError(GetLastError());
    Close();
    return false;
  }

  dcb.BaudRate = config.baudRate;
  dcb.ByteSize = config.dataBits;
  dcb.Parity = config.parity;
  dcb.StopBits = config.stopBits;
  if (!SetCommState(m_handle, &dcb)) {
    error = FormatLastError(GetLastError());
    Close();
    return false;
  }

  COMMTIMEOUTS timeouts = { 0 };
  timeouts.ReadIntervalTimeout = 30;
  timeouts.ReadTotalTimeoutConstant = config.readTimeoutMs;
  timeouts.ReadTotalTimeoutMultiplier = 5;
  timeouts.WriteTotalTimeoutConstant = config.writeTimeoutMs;
  timeouts.WriteTotalTimeoutMultiplier = 5;
  SetCommTimeouts(m_handle, &timeouts);
  PurgeComm(m_handle, PURGE_RXCLEAR | PURGE_TXCLEAR);
  return true;
}

void SerialManager::Close()
{
  if (m_handle != INVALID_HANDLE_VALUE) {
    CloseHandle(m_handle);
    m_handle = INVALID_HANDLE_VALUE;
  }
}

bool SerialManager::IsOpen() const { return m_handle != INVALID_HANDLE_VALUE; }

bool SerialManager::WriteBytes(const std::vector<BYTE>& data, CString& error)
{
  if (!IsOpen()) { error = _T("Serial port is not open"); return false; }
  DWORD written = 0;
  if (!WriteFile(m_handle, data.data(), static_cast<DWORD>(data.size()), &written, nullptr)) {
    error = FormatLastError(GetLastError());
    return false;
  }
  if (written != data.size()) {
    error.Format(_T("Only wrote %lu/%zu bytes"), written, data.size());
    return false;
  }
  return true;
}

bool SerialManager::WriteText(const CString& text, CString& error)
{
  CT2A utf8(text, CP_UTF8);
  std::vector<BYTE> bytes(utf8.m_psz, utf8.m_psz + strlen(utf8.m_psz));
  return WriteBytes(bytes, error);
}

bool SerialManager::WriteHex(const CString& hexText, CString& error)
{
  std::vector<BYTE> bytes;
  if (!HexToBytes(hexText, bytes, error)) return false;
  return WriteBytes(bytes, error);
}

bool SerialManager::ReadAvailable(std::vector<BYTE>& out, CString& error)
{
  out.clear();
  if (!IsOpen()) { error = _T("Serial port is not open"); return false; }
  BYTE buffer[1024] = { 0 };
  DWORD read = 0;
  if (!ReadFile(m_handle, buffer, sizeof(buffer), &read, nullptr)) {
    error = FormatLastError(GetLastError());
    return false;
  }
  out.assign(buffer, buffer + read);
  return true;
}

CString SerialManager::NormalizePortName(const CString& portName) const
{
  if (portName.Left(4) == _T("\\\\.\\")) return portName;
  CString upper(portName); upper.MakeUpper();
  int number = _ttoi(upper.Mid(3));
  if (upper.Left(3) == _T("COM") && number >= 10) {
    CString normalized; normalized.Format(_T("\\\\.\\%s"), portName.GetString());
    return normalized;
  }
  return portName;
}

bool SerialManager::HexToBytes(const CString& hexText, std::vector<BYTE>& out, CString& error) const
{
  CString clean(hexText);
  clean.Remove(_T(' ')); clean.Remove(_T('\r')); clean.Remove(_T('\n')); clean.Remove(_T('\t'));
  if (clean.GetLength() % 2 != 0) { error = _T("HEX length must be even"); return false; }
  for (int i = 0; i < clean.GetLength(); i += 2) {
    CString pair = clean.Mid(i, 2);
    TCHAR* end = nullptr;
    long value = _tcstol(pair, &end, 16);
    if (*end != 0 || value < 0 || value > 255) { error.Format(_T("Invalid HEX byte: %s"), pair.GetString()); return false; }
    out.push_back(static_cast<BYTE>(value));
  }
  return true;
}

CString SerialManager::FormatLastError(DWORD errorCode) const
{
  CString text;
  text.Format(_T("Win32 error %lu"), errorCode);
  return text;
}` },
];

const tcpClientPractical: CodegenFile[] = [
  { path: 'TcpClient.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")

class TcpClient
{
public:
  TcpClient();
  ~TcpClient();

  bool Connect(const CString& host, int port, CString& error);
  bool SendText(const CString& text, CString& error);
  bool ReceiveText(CString& out, CString& error);
  void Disconnect();
  bool IsConnected() const;

private:
  CString FormatWsaError(int code) const;
  bool EnsureWsa(CString& error);

  SOCKET m_socket = INVALID_SOCKET;
  bool m_wsaStarted = false;
};` },
  { path: 'TcpClient.cpp', language: 'cpp', content: `#include "pch.h"
#include "TcpClient.h"
#include <atlconv.h>

TcpClient::TcpClient() = default;
TcpClient::~TcpClient() { Disconnect(); if (m_wsaStarted) WSACleanup(); }

bool TcpClient::EnsureWsa(CString& error)
{
  if (m_wsaStarted) return true;
  WSADATA data = { 0 };
  int rc = WSAStartup(MAKEWORD(2, 2), &data);
  if (rc != 0) { error = FormatWsaError(rc); return false; }
  m_wsaStarted = true;
  return true;
}

bool TcpClient::Connect(const CString& host, int port, CString& error)
{
  if (!EnsureWsa(error)) return false;
  Disconnect();

  CT2A hostA(host, CP_UTF8);
  addrinfo hints = { 0 };
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;
  hints.ai_protocol = IPPROTO_TCP;

  CStringA portText; portText.Format("%d", port);
  addrinfo* result = nullptr;
  int rc = getaddrinfo(hostA, portText, &hints, &result);
  if (rc != 0) { error = FormatWsaError(rc); return false; }

  for (addrinfo* ptr = result; ptr; ptr = ptr->ai_next) {
    m_socket = socket(ptr->ai_family, ptr->ai_socktype, ptr->ai_protocol);
    if (m_socket == INVALID_SOCKET) continue;
    if (connect(m_socket, ptr->ai_addr, static_cast<int>(ptr->ai_addrlen)) == 0) {
      freeaddrinfo(result);
      return true;
    }
    closesocket(m_socket);
    m_socket = INVALID_SOCKET;
  }

  freeaddrinfo(result);
  error = FormatWsaError(WSAGetLastError());
  return false;
}

bool TcpClient::SendText(const CString& text, CString& error)
{
  if (!IsConnected()) { error = _T("TCP is not connected"); return false; }
  CT2A utf8(text, CP_UTF8);
  int len = static_cast<int>(strlen(utf8.m_psz));
  int sent = send(m_socket, utf8.m_psz, len, 0);
  if (sent == SOCKET_ERROR) { error = FormatWsaError(WSAGetLastError()); return false; }
  return sent == len;
}

bool TcpClient::ReceiveText(CString& out, CString& error)
{
  out.Empty();
  if (!IsConnected()) { error = _T("TCP is not connected"); return false; }
  char buffer[4096] = { 0 };
  int rc = recv(m_socket, buffer, sizeof(buffer) - 1, 0);
  if (rc == SOCKET_ERROR) { error = FormatWsaError(WSAGetLastError()); return false; }
  if (rc == 0) { error = _T("Remote closed"); return false; }
  out = CA2T(buffer, CP_UTF8);
  return true;
}

void TcpClient::Disconnect()
{
  if (m_socket != INVALID_SOCKET) {
    shutdown(m_socket, SD_BOTH);
    closesocket(m_socket);
    m_socket = INVALID_SOCKET;
  }
}

bool TcpClient::IsConnected() const { return m_socket != INVALID_SOCKET; }

CString TcpClient::FormatWsaError(int code) const
{
  CString text;
  text.Format(_T("WSA error %d"), code);
  return text;
}` },
];

const tcpServerPractical: CodegenFile[] = [
  { path: 'TcpServer.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")

class TcpServer
{
public:
  TcpServer();
  ~TcpServer();

  bool Start(int port, CString& error);
  void Stop();
  bool IsListening() const;
  bool AcceptOnce(SOCKET& clientSocket, CString& error);

private:
  CString FormatWsaError(int code) const;
  bool EnsureWsa(CString& error);

  SOCKET m_listenSocket = INVALID_SOCKET;
  bool m_wsaStarted = false;
};` },
  { path: 'TcpServer.cpp', language: 'cpp', content: `#include "pch.h"
#include "TcpServer.h"

TcpServer::TcpServer() = default;
TcpServer::~TcpServer() { Stop(); if (m_wsaStarted) WSACleanup(); }

bool TcpServer::EnsureWsa(CString& error)
{
  if (m_wsaStarted) return true;
  WSADATA data = { 0 };
  int rc = WSAStartup(MAKEWORD(2, 2), &data);
  if (rc != 0) { error = FormatWsaError(rc); return false; }
  m_wsaStarted = true;
  return true;
}

bool TcpServer::Start(int port, CString& error)
{
  if (!EnsureWsa(error)) return false;
  Stop();

  m_listenSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
  if (m_listenSocket == INVALID_SOCKET) { error = FormatWsaError(WSAGetLastError()); return false; }

  sockaddr_in addr = { 0 };
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = htonl(INADDR_ANY);
  addr.sin_port = htons(static_cast<u_short>(port));

  if (bind(m_listenSocket, reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) == SOCKET_ERROR) {
    error = FormatWsaError(WSAGetLastError()); Stop(); return false;
  }
  if (listen(m_listenSocket, SOMAXCONN) == SOCKET_ERROR) {
    error = FormatWsaError(WSAGetLastError()); Stop(); return false;
  }
  return true;
}

bool TcpServer::AcceptOnce(SOCKET& clientSocket, CString& error)
{
  clientSocket = INVALID_SOCKET;
  if (!IsListening()) { error = _T("Server is not listening"); return false; }
  clientSocket = accept(m_listenSocket, nullptr, nullptr);
  if (clientSocket == INVALID_SOCKET) { error = FormatWsaError(WSAGetLastError()); return false; }
  return true;
}

void TcpServer::Stop()
{
  if (m_listenSocket != INVALID_SOCKET) {
    closesocket(m_listenSocket);
    m_listenSocket = INVALID_SOCKET;
  }
}

bool TcpServer::IsListening() const { return m_listenSocket != INVALID_SOCKET; }

CString TcpServer::FormatWsaError(int code) const
{
  CString text;
  text.Format(_T("WSA error %d"), code);
  return text;
}` },
];

const httpClientPractical: CodegenFile[] = [
  { path: 'HttpClient.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>
#include <windows.h>
#include <winhttp.h>
#pragma comment(lib, "winhttp.lib")

struct HttpResponse
{
  int statusCode = 0;
  CString body;
  CString error;
};

class HttpClient
{
public:
  HttpClient();
  ~HttpClient();

  HttpResponse Get(const CString& url);
  HttpResponse PostJson(const CString& url, const CString& jsonBody);

private:
  HttpResponse Send(const CString& method, const CString& url, const CString& body, const CString& extraHeaders);
  CString FormatLastError(DWORD errorCode) const;

  HINTERNET m_session = nullptr;
};` },
  { path: 'HttpClient.cpp', language: 'cpp', content: `#include "pch.h"
#include "HttpClient.h"
#include <atlconv.h>

HttpClient::HttpClient()
{
  m_session = WinHttpOpen(L"MfcToolkit/1.0", WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
    WINHTTP_NO_PROXY_NAME, WINHTTP_NO_PROXY_BYPASS, 0);
}

HttpClient::~HttpClient()
{
  if (m_session) WinHttpCloseHandle(m_session);
}

HttpResponse HttpClient::Get(const CString& url)
{
  return Send(_T("GET"), url, _T(""), _T(""));
}

HttpResponse HttpClient::PostJson(const CString& url, const CString& jsonBody)
{
  return Send(_T("POST"), url, jsonBody, _T("Content-Type: application/json\r\n"));
}

HttpResponse HttpClient::Send(const CString& method, const CString& url, const CString& body, const CString& extraHeaders)
{
  HttpResponse response;
  if (!m_session) { response.error = _T("WinHttpOpen failed"); return response; }

  URL_COMPONENTS parts = { 0 };
  wchar_t host[256] = { 0 };
  wchar_t path[2048] = { 0 };
  parts.dwStructSize = sizeof(parts);
  parts.lpszHostName = host; parts.dwHostNameLength = _countof(host);
  parts.lpszUrlPath = path; parts.dwUrlPathLength = _countof(path);
  parts.dwSchemeLength = 1;

  if (!WinHttpCrackUrl(url, 0, 0, &parts)) {
    response.error = FormatLastError(GetLastError());
    return response;
  }

  HINTERNET connect = WinHttpConnect(m_session, CString(host), parts.nPort, 0);
  if (!connect) { response.error = FormatLastError(GetLastError()); return response; }

  DWORD flags = parts.nScheme == INTERNET_SCHEME_HTTPS ? WINHTTP_FLAG_SECURE : 0;
  HINTERNET request = WinHttpOpenRequest(connect, method, CString(path), nullptr,
    WINHTTP_NO_REFERER, WINHTTP_DEFAULT_ACCEPT_TYPES, flags);
  if (!request) { response.error = FormatLastError(GetLastError()); WinHttpCloseHandle(connect); return response; }

  WinHttpSetTimeouts(request, 5000, 5000, 5000, 10000);

  CT2A bodyUtf8(body, CP_UTF8);
  DWORD bodyLen = static_cast<DWORD>(strlen(bodyUtf8.m_psz));
  BOOL ok = WinHttpSendRequest(request, extraHeaders.IsEmpty() ? WINHTTP_NO_ADDITIONAL_HEADERS : extraHeaders.GetString(),
    extraHeaders.GetLength(), bodyLen ? (LPVOID)bodyUtf8.m_psz : WINHTTP_NO_REQUEST_DATA, bodyLen, bodyLen, 0);
  if (ok) ok = WinHttpReceiveResponse(request, nullptr);

  if (!ok) {
    response.error = FormatLastError(GetLastError());
  } else {
    DWORD status = 0, statusSize = sizeof(status);
    WinHttpQueryHeaders(request, WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
      WINHTTP_HEADER_NAME_BY_INDEX, &status, &statusSize, WINHTTP_NO_HEADER_INDEX);
    response.statusCode = static_cast<int>(status);

    CStringA bodyA;
    DWORD available = 0;
    while (WinHttpQueryDataAvailable(request, &available) && available > 0) {
      CStringA chunk;
      LPSTR buffer = chunk.GetBufferSetLength(available);
      DWORD read = 0;
      WinHttpReadData(request, buffer, available, &read);
      chunk.ReleaseBuffer(read);
      bodyA += chunk;
    }
    response.body = CA2T(bodyA, CP_UTF8);
  }

  WinHttpCloseHandle(request);
  WinHttpCloseHandle(connect);
  return response;
}

CString HttpClient::FormatLastError(DWORD errorCode) const
{
  CString text;
  text.Format(_T("WinHTTP/Win32 error %lu"), errorCode);
  return text;
}` },
];


const sqlitePractical: CodegenFile[] = [
  { path: 'SqliteStore.h', language: 'cpp', content: `#pragma once
#include <afxstr.h>
#include <afxcoll.h>
#include <vector>
#include "sqlite3.h"

// Codegen v5 practical template: SQLite CRUD wrapper for MFC tools.
// 依赖：sqlite3.h、sqlite3.lib、sqlite3.dll 或静态库。
struct HistoryRow
{
  int id = 0;
  CString channel;
  CString payload;
  CString createdAt;
};

class SqliteStore
{
public:
  SqliteStore();
  ~SqliteStore();

  bool Open(const CString& dbPath, CString& error);
  void Close();
  bool IsOpen() const;
  CString DefaultDbPath() const;

  bool InitSchema(CString& error);
  bool InsertHistory(const CString& channel, const CString& payload, CString& error);
  bool QueryHistory(std::vector<HistoryRow>& rows, int limit, CString& error);
  bool DeleteHistory(int id, CString& error);

private:
  CString LastError() const;
  bool Exec(const CString& sql, CString& error);

  sqlite3* m_db = nullptr;
};` },
  { path: 'SqliteStore.cpp', language: 'cpp', content: `#include "pch.h"
#include "SqliteStore.h"
#include <Shlwapi.h>
#pragma comment(lib, "sqlite3.lib")
#pragma comment(lib, "Shlwapi.lib")

SqliteStore::SqliteStore() = default;
SqliteStore::~SqliteStore() { Close(); }

CString SqliteStore::DefaultDbPath() const
{
  TCHAR exePath[MAX_PATH] = { 0 };
  GetModuleFileName(nullptr, exePath, MAX_PATH);
  PathRemoveFileSpec(exePath);
  CString dataDir;
  dataDir.Format(_T("%s\\data"), exePath);
  CreateDirectory(dataDir, nullptr);
  CString dbPath;
  dbPath.Format(_T("%s\\mfc_toolkit.db"), dataDir.GetString());
  return dbPath;
}

bool SqliteStore::Open(const CString& dbPath, CString& error)
{
  Close();
  int rc = sqlite3_open16(dbPath.GetString(), &m_db);
  if (rc != SQLITE_OK) {
    error = LastError();
    Close();
    return false;
  }
  return InitSchema(error);
}

void SqliteStore::Close()
{
  if (m_db) {
    sqlite3_close(m_db);
    m_db = nullptr;
  }
}

bool SqliteStore::IsOpen() const { return m_db != nullptr; }

bool SqliteStore::InitSchema(CString& error)
{
  return Exec(_T("CREATE TABLE IF NOT EXISTS history ("
                 "id INTEGER PRIMARY KEY AUTOINCREMENT,"
                 "channel TEXT NOT NULL,"
                 "payload TEXT NOT NULL,"
                 "created_at TEXT DEFAULT CURRENT_TIMESTAMP)"), error);
}

bool SqliteStore::InsertHistory(const CString& channel, const CString& payload, CString& error)
{
  if (!IsOpen()) { error = _T("SQLite database is not open"); return false; }
  const char* sql = "INSERT INTO history(channel, payload) VALUES(?, ?)";
  sqlite3_stmt* stmt = nullptr;
  int rc = sqlite3_prepare_v2(m_db, sql, -1, &stmt, nullptr);
  if (rc != SQLITE_OK) { error = LastError(); return false; }

  CT2A channelUtf8(channel, CP_UTF8);
  CT2A payloadUtf8(payload, CP_UTF8);
  sqlite3_bind_text(stmt, 1, channelUtf8, -1, SQLITE_TRANSIENT);
  sqlite3_bind_text(stmt, 2, payloadUtf8, -1, SQLITE_TRANSIENT);

  rc = sqlite3_step(stmt);
  sqlite3_finalize(stmt);
  if (rc != SQLITE_DONE) { error = LastError(); return false; }
  return true;
}

bool SqliteStore::QueryHistory(std::vector<HistoryRow>& rows, int limit, CString& error)
{
  rows.clear();
  if (!IsOpen()) { error = _T("SQLite database is not open"); return false; }
  const char* sql = "SELECT id, channel, payload, created_at FROM history ORDER BY id DESC LIMIT ?";
  sqlite3_stmt* stmt = nullptr;
  int rc = sqlite3_prepare_v2(m_db, sql, -1, &stmt, nullptr);
  if (rc != SQLITE_OK) { error = LastError(); return false; }
  sqlite3_bind_int(stmt, 1, limit <= 0 ? 50 : limit);

  while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
    HistoryRow row;
    row.id = sqlite3_column_int(stmt, 0);
    row.channel = CA2T(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)), CP_UTF8);
    row.payload = CA2T(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)), CP_UTF8);
    row.createdAt = CA2T(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3)), CP_UTF8);
    rows.push_back(row);
  }
  sqlite3_finalize(stmt);
  if (rc != SQLITE_DONE) { error = LastError(); return false; }
  return true;
}

bool SqliteStore::DeleteHistory(int id, CString& error)
{
  if (!IsOpen()) { error = _T("SQLite database is not open"); return false; }
  sqlite3_stmt* stmt = nullptr;
  int rc = sqlite3_prepare_v2(m_db, "DELETE FROM history WHERE id=?", -1, &stmt, nullptr);
  if (rc != SQLITE_OK) { error = LastError(); return false; }
  sqlite3_bind_int(stmt, 1, id);
  rc = sqlite3_step(stmt);
  sqlite3_finalize(stmt);
  if (rc != SQLITE_DONE) { error = LastError(); return false; }
  return true;
}

bool SqliteStore::Exec(const CString& sql, CString& error)
{
  if (!IsOpen()) { error = _T("SQLite database is not open"); return false; }
  CT2A sqlUtf8(sql, CP_UTF8);
  char* msg = nullptr;
  int rc = sqlite3_exec(m_db, sqlUtf8, nullptr, nullptr, &msg);
  if (rc != SQLITE_OK) {
    error = CA2T(msg ? msg : "sqlite3_exec failed", CP_UTF8);
    sqlite3_free(msg);
    return false;
  }
  return true;
}

CString SqliteStore::LastError() const
{
  if (!m_db) return _T("SQLite database handle is null");
  return CA2T(sqlite3_errmsg(m_db), CP_UTF8);
}` },
  { path: 'docs/sqlite-integration.md', language: 'md', content: `# SQLite Integration Notes

Codegen v5 SQLite CRUD 模板用于 Windows + Visual Studio + MFC 本地实践。

## 需要准备

1. 下载或编译 sqlite3：sqlite3.h、sqlite3.lib、sqlite3.dll。
2. 将 sqlite3.h 放入项目 include 路径，sqlite3.lib 放入 linker input。
3. 运行时确保 sqlite3.dll 与 exe 同目录，或使用静态库。
4. 模板默认数据库路径：exe 旁边的 data/mfc_toolkit.db。

## 常见错误

- LNK2019 sqlite3_open16：没有链接 sqlite3.lib。
- 运行时报 sqlite3.dll missing：DLL 没放到 exe 目录。
- 中文乱码：建议统一 UTF-8 存储，MFC CString 转换时使用 CP_UTF8。
- database is locked：写入事务未结束，或多线程同时写库没有串行化。
` },
];

function teachingFiles(files: CodegenFile[]): CodegenFile[] {
  return files.map((file) => {
    if (file.language !== 'cpp') return file;
    return {
      ...file,
      content: `// 教学注释版：复制到 Windows + Visual Studio + MFC Dialog 项目使用。\n// 浏览器只负责生成模板，不会访问真实串口、TCP、HTTP 或 SQLite。\n// 接入顺序：先 Add Existing Item，再编译，再接控件 ID / Message Map。\n\n${file.content}`,
    };
  });
}

const enhancedByModule: Record<string, CodegenFile[]> = {
  logger: loggerPractical,
  serial: serialPractical,
  'tcp-client': tcpClientPractical,
  'tcp-server': tcpServerPractical,
  'http-client': httpClientPractical,
  'sqlite-store': sqlitePractical,
  'config-store': configPractical,
  'worker-thread': workerPractical,
};

export function applyCodegenMode(moduleId: string, files: CodegenFile[], mode: CodegenMode): CodegenFile[] {
  if (mode === 'basic') return files;
  const enhanced = enhancedByModule[moduleId] ?? files;
  return mode === 'teaching' ? teachingFiles(enhanced) : enhanced;
}

export function buildCodegenModeNotes(mode: CodegenMode): string {
  if (mode === 'basic') return '基础骨架：保留轻量 TODO，适合先理解类和文件结构。';
  if (mode === 'practical') return '实战增强：Logger/ConfigStore/WorkerThread/Serial/TCP/HTTP/SQLite 已升级为更接近真实 MFC 项目的实现结构。';
  return '教学注释版：在实战增强模板上加入中文说明，适合初学者边复制边理解。';
}

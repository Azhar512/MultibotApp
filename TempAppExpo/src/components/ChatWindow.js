import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native"
import { Bot, User } from "lucide-react-native"
import { THEME } from "../styles/globalStyles"

const ChatWindow = ({ messages, isLoading, error }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Bot size={48} color={THEME.textLight} />
            <Text style={styles.emptyText}>Start a conversation with your AI bot</Text>
          </View>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.sender === "user" ? styles.userMessage : styles.botMessage]}
          >
            <View style={styles.messageHeader}>
              <View style={styles.avatarContainer}>
                {message.sender === "user" ? (
                  <User size={16} color={THEME.text} />
                ) : (
                  <Bot size={16} color={THEME.text} />
                )}
              </View>
              <Text style={styles.senderName}>{message.sender === "user" ? "You" : "AI Bot"}</Text>
              <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
            </View>

            <View
              style={[
                styles.messageBubble,
                message.sender === "user" ? styles.userBubble : styles.botBubble,
                message.isError && styles.errorBubble,
              ]}
            >
              <Text style={[styles.messageText, message.isError && styles.errorText]}>{message.text}</Text>
            </View>

            {message.confidence && (
              <Text style={styles.confidence}>Confidence: {Math.round(message.confidence * 100)}%</Text>
            )}

            {message.sentiment && <Text style={styles.sentiment}>Sentiment: {message.sentiment}</Text>}
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={THEME.text} />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 400,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: THEME.textLight,
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  botMessage: {
    alignItems: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  senderName: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
  timestamp: {
    color: THEME.textLight,
    fontSize: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: THEME.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    borderColor: THEME.error,
    borderWidth: 1,
  },
  messageText: {
    color: THEME.text,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: THEME.error,
  },
  confidence: {
    color: THEME.textLight,
    fontSize: 10,
    marginTop: 4,
  },
  sentiment: {
    color: THEME.textLight,
    fontSize: 10,
    marginTop: 2,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: {
    color: THEME.textLight,
    fontSize: 14,
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
})

export default ChatWindow
